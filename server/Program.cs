using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using server.Services;
using server.src.Services;
using server.src.Hubs;
using QuestPDF.Infrastructure;
using DotNetEnv; // ensure using

var builder = WebApplication.CreateBuilder(args);

// 🟢 Load .env BEFORE accessing configuration
Env.Load();

// 🟢 Map .env to configuration
builder.Configuration.AddEnvironmentVariables();

// QuestPDF
QuestPDF.Settings.License = LicenseType.Community;

// MongoDB config
builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddSingleton<MongoDBContext>();
builder.Services.AddSingleton<ResidentService>();
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<FileStorageService>();
builder.Services.AddSingleton<BarangayConfigService>();
builder.Services.AddSingleton<DocumentService>();
builder.Services.AddSingleton<StaffService>();
builder.Services.AddSingleton<DocumentRequestService>();
builder.Services.AddSingleton<DocumentTemplateService>();
builder.Services.AddSingleton<DocumentGenerationService>();
builder.Services.AddSingleton<DashboardService>();

// Notification service
builder.Services.AddSingleton<INotificationService, NotificationService>();

// 🟢 Bind JWT settings from configuration (.env or appsettings.json)
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddSingleton<JwtService>();

// Cloudinary config - Override with environment variables
builder.Services.Configure<CloudinarySettings>(options =>
{
    options.CloudName = Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME") 
                       ?? throw new Exception("CLOUDINARY_CLOUD_NAME not found in environment variables");
    options.ApiKey = Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY") 
                    ?? throw new Exception("CLOUDINARY_API_KEY not found in environment variables");
    options.ApiSecret = Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET") 
                       ?? throw new Exception("CLOUDINARY_API_SECRET not found in environment variables");
});
builder.Services.AddSingleton<CloudinaryService>();

// Email service
builder.Services.AddHttpClient();
builder.Services.AddSingleton<EmailService>();
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<RateLimiterService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Bridge System API",
        Version = "v1",
        Description = "API for Bridge Barangay Management System"
    });

    // Map IFormFile as binary in Swagger
    options.MapType<IFormFile>(() => new Microsoft.OpenApi.Models.OpenApiSchema
    {
        Type = "string",
        Format = "binary"
    });

    // Add the custom file upload operation filter
    options.OperationFilter<FileUploadOperationFilter>();
});

// Add SignalR
builder.Services.AddSignalR();


// CORS - Allow origins from environment variable (supports production + development)
var allowedOriginsString = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS") 
    ?? "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176";
var allowedOrigins = allowedOriginsString.Split(',', StringSplitOptions.RemoveEmptyEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("_myAllowSpecificOrigins", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .WithExposedHeaders("X-Rate-Limit-Remaining", "X-Rate-Limit-Reset");
    });
});

// 🟢 Read key from environment directly
string jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")
                ?? throw new Exception("JWT_KEY not found in environment variables");

var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

// JWT Auth
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ClockSkew = TimeSpan.Zero // optional but recommended
    };

    // Configure JWT for SignalR
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/notificationHub"))
            {
                context.Token = accessToken;
            }
            
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// Register background services
builder.Services.AddHostedService<AccountCleanupService>();

// Configure Kestrel to listen on the PORT environment variable (for Render/Docker)
// In Development, use launchSettings.json. In Production, use PORT env variable
if (!builder.Environment.IsDevelopment())
{
    var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
    builder.WebHost.ConfigureKestrel(options =>
    {
        options.ListenAnyIP(int.Parse(port));
    });
}

var app = builder.Build();

// Security Headers Middleware
app.Use(async (context, next) =>
{
    // Prevent clickjacking attacks
    context.Response.Headers["X-Frame-Options"] = "DENY";

    // Prevent MIME type sniffing
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";

    // XSS Protection (legacy but still useful for older browsers)
    context.Response.Headers["X-XSS-Protection"] = "1; mode=block";

    // Referrer Policy
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";

    // 🔒 Cross-Origin-Opener-Policy: Allow Google OAuth popup to work
    context.Response.Headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups";

    // Content Security Policy - Dynamic for production
    var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:5173";
    var currentHost = context.Request.Host.ToString();
    
    context.Response.Headers["Content-Security-Policy"] =
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https: blob:; " +
        "font-src 'self' data:; " +
        $"connect-src 'self' {frontendUrl} https://{currentHost} wss://{currentHost} http://localhost:* ws://localhost:* https://accounts.google.com https://www.googleapis.com https://res.cloudinary.com; " +
        "frame-src https://accounts.google.com;";

    // Remove server header
    context.Response.Headers.Remove("Server");

    await next();
});

app.UseCors("_myAllowSpecificOrigins");
app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Map SignalR hub
app.MapHub<NotificationHub>("/notificationHub");

// Health check endpoint (for Render and monitoring)
app.MapGet("/health", () => Results.Ok(new 
{ 
    status = "healthy", 
    timestamp = DateTime.UtcNow,
    environment = app.Environment.EnvironmentName
}));

app.Run();
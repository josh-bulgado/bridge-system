using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using server.Services;
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

// 🟢 Bind JWT settings from configuration (.env or appsettings.json)
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddSingleton<JwtService>();

// Email service
builder.Services.AddHttpClient();
builder.Services.AddSingleton<EmailService>();
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<RateLimiterService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS - Allow multiple local development ports with security headers
builder.Services.AddCors(options =>
{
    options.AddPolicy("_myAllowSpecificOrigins", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173", 
                "http://localhost:5174", 
                "http://localhost:5175", 
                "http://localhost:5176"
              )
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
});

builder.Services.AddAuthorization();

// Register background services
builder.Services.AddHostedService<AccountCleanupService>();

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
    
    // Content Security Policy
    context.Response.Headers["Content-Security-Policy"] = 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self' data:; " +
        "connect-src 'self' http://localhost:* ws://localhost:* https://accounts.google.com https://www.googleapis.com; " +
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
app.Run();

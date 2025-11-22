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

// 🟢 Bind JWT settings from configuration (.env or appsettings.json)
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddSingleton<JwtService>();

// Email service
builder.Services.AddHttpClient();
builder.Services.AddSingleton<EmailService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS - Allow multiple local development ports
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
              .AllowCredentials();
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
    
    // Content Security Policy
    context.Response.Headers["Content-Security-Policy"] = 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self' data:; " +
        "connect-src 'self' http://localhost:* ws://localhost:*;";
    
    // Remove server header
    context.Response.Headers.Remove("Server");
    
    await next();
});

// Rate Limiting Headers Middleware (basic implementation)
var requestCounts = new System.Collections.Concurrent.ConcurrentDictionary<string, (DateTime, int)>();
app.Use(async (context, next) =>
{
    var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    var now = DateTime.UtcNow;
    
    // Clean up old entries (older than 1 minute)
    var keysToRemove = requestCounts.Where(kvp => (now - kvp.Value.Item1).TotalMinutes > 1).Select(kvp => kvp.Key).ToList();
    foreach (var key in keysToRemove)
    {
        requestCounts.TryRemove(key, out _);
    }
    
    // Check rate limit for sensitive endpoints
    if (context.Request.Path.StartsWithSegments("/api/auth") || 
        context.Request.Path.StartsWithSegments("/api/Auth"))
    {
        var (timestamp, count) = requestCounts.GetOrAdd(ipAddress, (now, 0));
        
        // Reset if more than 1 minute has passed
        if ((now - timestamp).TotalMinutes > 1)
        {
            requestCounts[ipAddress] = (now, 1);
        }
        else
        {
            // Max 20 requests per minute for auth endpoints
            if (count >= 20)
            {
                context.Response.StatusCode = 429; // Too Many Requests
                await context.Response.WriteAsync("Rate limit exceeded. Please try again later.");
                return;
            }
            requestCounts[ipAddress] = (timestamp, count + 1);
        }
    }
    
    await next();
});

app.UseCors("_myAllowSpecificOrigins");
app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

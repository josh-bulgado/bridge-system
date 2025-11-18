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

// 🟢 Bind JWT settings from configuration (.env or appsettings.json)
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddSingleton<JwtService>();

// Email service
builder.Services.AddHttpClient();
builder.Services.AddSingleton<EmailService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("_myAllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
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

app.UseCors("_myAllowSpecificOrigins");
app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

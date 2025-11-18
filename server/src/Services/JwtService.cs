using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using server.Models;

public class JwtService
{
    private readonly JwtSettings _jwt;

    public JwtService()
    {
        _jwt = new JwtSettings
        {
            Key = Environment.GetEnvironmentVariable("JWT_KEY") ?? throw new Exception("JWT_KEY not found"),
            Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "bridge-system"
        };

        if (_jwt.Key.Length < 32)
            throw new Exception("Jwt:Key must be at least 32 characters long.");
    }


    public string GenerateToken(User user)
    {
        var key = Encoding.ASCII.GetBytes(_jwt.Key);
        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id!.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            }),
            Expires = DateTime.UtcNow.AddHours(3),
            Issuer = _jwt.Issuer,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
    }
}

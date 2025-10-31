using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using server.DTOs;
using BCrypt.Net;

namespace server.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly UserService _userService;
    private readonly ResidentService _residentService;

    public AuthController(UserService userService, ResidentService residentService)
    {
      _userService = userService;
      _residentService = residentService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest dto)
    {
      // 1️⃣ Check if email already exists
      var existingUser = await _userService.GetByEmailAsync(dto.Email);
      if (existingUser != null)
        return BadRequest(new { message = "Email already registered." });

      // 2️⃣ Create Resident
      var resident = new Resident
      {
        FirstName = dto.FirstName,
        MiddleName = dto.MiddleName,
        LastName = dto.LastName,
        Extension = dto.Extension,
        DateOfBirth = dto.DateOfBirth,
        ContactNumber = dto.ContactNumber,
        IsResidentVerified = false,
        ResidentVerificationStatus = "Pending",
      };

      await _residentService.CreateAsync(resident);

      // 3️⃣ Create User linked to Resident
      var user = new User
      {
        Email = dto.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        Role = "resident",
        ResidentId = resident.Id,
        IsActive = true,
        IsEmailVerified = false,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
      };

      await _userService.CreateAsync(user);

      // 4️⃣ Return clean response
      return Ok(new { message = "Registration successful. Please verify your email." });
    }
  }
}

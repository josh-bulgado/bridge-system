
using Microsoft.AspNetCore.Mvc;
using QRCoder;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using server.Models;
using server.Services;

namespace MongoBackend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UserController : ControllerBase
  {
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
      _userService = userService;
    }

    [HttpGet]
    public async Task<List<User>> Get() =>
        await _userService.GetAsync();

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] User user)
    {
      await _userService.CreateAsync(user);
      return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }
  }
}

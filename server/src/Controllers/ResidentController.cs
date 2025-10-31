using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using System.ComponentModel.DataAnnotations;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResidentController : ControllerBase
    {
        private readonly ResidentService _residentService;

        public ResidentController(ResidentService residentService)
        {
            _residentService = residentService;
        }


    }





}
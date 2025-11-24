using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using server.DTOs.BarangayConfig;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BarangayConfigController : ControllerBase
    {
        private readonly BarangayConfigService _barangayConfigService;

        public BarangayConfigController(BarangayConfigService barangayConfigService)
        {
            _barangayConfigService = barangayConfigService;
        }

        [HttpGet]
        public async Task<IActionResult> GetConfig()
        {
            try
            {
                var config = await _barangayConfigService.GetConfigAsync();
                
                if (config == null)
                {
                    return NotFound(new { message = "Barangay configuration not found." });
                }

                var response = MapToResponse(config);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the configuration.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrUpdateConfig([FromBody] BarangayConfigRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Get user ID from JWT token (if authenticated)
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var config = MapToModel(request);
                var savedConfig = await _barangayConfigService.CreateOrUpdateConfigAsync(config, userId);

                var response = MapToResponse(savedConfig);
                return Ok(new { message = "Barangay configuration saved successfully.", data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while saving the configuration.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateConfig(string id, [FromBody] BarangayConfigRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if config exists
                var existingConfig = await _barangayConfigService.GetConfigAsync();
                if (existingConfig == null || existingConfig.Id != id)
                {
                    return NotFound(new { message = "Barangay configuration not found." });
                }

                var config = MapToModel(request);
                config.Id = id;
                config.CreatedAt = existingConfig.CreatedAt;

                var updatedConfig = await _barangayConfigService.UpdateConfigAsync(id, config);

                var response = MapToResponse(updatedConfig);
                return Ok(new { message = "Barangay configuration updated successfully.", data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the configuration.", error = ex.Message });
            }
        }

        [HttpGet("exists")]
        public async Task<IActionResult> CheckConfigExists()
        {
            try
            {
                var exists = await _barangayConfigService.ConfigExistsAsync();
                return Ok(new { exists });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking configuration.", error = ex.Message });
            }
        }

        [HttpGet("gcash")]
        public async Task<IActionResult> GetGcashConfig()
        {
            try
            {
                var config = await _barangayConfigService.GetConfigAsync();
                
                if (config == null)
                {
                    return NotFound(new { message = "Barangay configuration not found." });
                }

                var gcashInfo = new
                {
                    gcashNumber = config.GcashNumber,
                    gcashAccountName = config.GcashAccountName,
                    gcashQrCodeUrl = config.GcashQrCodeUrl
                };

                return Ok(gcashInfo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving GCash configuration.", error = ex.Message });
            }
        }

        private static BarangayConfig MapToModel(BarangayConfigRequest request)
        {
            return new BarangayConfig
            {
                BarangayCaptain = request.BarangayCaptain,
                LogoUrl = request.LogoUrl,
                Address = new BarangayAddress
                {
                    RegionCode = request.Address.RegionCode,
                    RegionName = request.Address.RegionName,
                    ProvinceCode = request.Address.ProvinceCode,
                    ProvinceName = request.Address.ProvinceName,
                    MunicipalityCode = request.Address.MunicipalityCode,
                    MunicipalityName = request.Address.MunicipalityName,
                    BarangayCode = request.Address.BarangayCode,
                    BarangayName = request.Address.BarangayName,
                },
                Contact = new BarangayContact
                {
                    Phone = request.Contact.Phone,
                    Email = request.Contact.Email,
                },
                OfficeHours = request.OfficeHours,
                GcashNumber = request.GcashNumber,
                GcashAccountName = request.GcashAccountName,
                GcashQrCodeUrl = request.GcashQrCodeUrl
            };
        }

        private static BarangayConfigResponse MapToResponse(BarangayConfig config)
        {
            return new BarangayConfigResponse
            {
                Id = config.Id ?? string.Empty,
                BarangayCaptain = config.BarangayCaptain,
                LogoUrl = config.LogoUrl,
                Address = new AddressResponse
                {
                    RegionCode = config.Address.RegionCode,
                    RegionName = config.Address.RegionName,
                    ProvinceCode = config.Address.ProvinceCode,
                    ProvinceName = config.Address.ProvinceName,
                    MunicipalityCode = config.Address.MunicipalityCode,
                    MunicipalityName = config.Address.MunicipalityName,
                    BarangayCode = config.Address.BarangayCode,
                    BarangayName = config.Address.BarangayName,
                },
                Contact = new ContactResponse
                {
                    Phone = config.Contact.Phone,
                    Email = config.Contact.Email,
                },
                OfficeHours = config.OfficeHours,
                GcashNumber = config.GcashNumber,
                GcashAccountName = config.GcashAccountName,
                GcashQrCodeUrl = config.GcashQrCodeUrl,
                CreatedAt = config.CreatedAt,
                UpdatedAt = config.UpdatedAt
            };
        }
    }
}
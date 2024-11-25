using System.Web.Mvc;
using AutoMapper;
using Jogging.Domain.DomainManagers;
using Jogging.Domain.Models;
using Jogging.Rest.DTOs.AccountDtos.ProfileDtos;
using Jogging.Rest.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Jogging.Rest.Controllers;

#if ProducesConsumes
    [Produces(MediaTypeNames.Application.Json)]
    [Consumes(MediaTypeNames.Application.Json)]
#endif

[Microsoft.AspNetCore.Mvc.Route("api/[controller]")]
[ApiController]
public class ProfileController : ControllerBaseExtension
{
    private readonly ProfileManager _profileManager;
    private readonly ILogger<ProfileController> _logger;
    private readonly IMapper _mapper;

    public ProfileController(ProfileManager profileManager, IMapper mapper, ILogger<ProfileController> logger)
    {
        _profileManager = profileManager;
        _mapper = mapper;
        _logger = logger;
    }

    #region PUT

    [Microsoft.AspNetCore.Mvc.HttpPut("{personId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePersonRole(int personId, [FromBody] ProfileRequestDTO profileRequestDto)
    {
        try
        {
            await _profileManager.UpdateProfileAsync(personId, _mapper.Map<ProfileDom>(profileRequestDto));
            return Ok("Successfully changed role.");
        }
        catch (Exception exception)
        {
            return InternalServerError(exception, _logger);
        }
    }

    #endregion
}
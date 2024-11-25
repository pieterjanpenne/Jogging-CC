using AutoMapper;
using Jogging.Domain.DomainManagers;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Models;
using Jogging.Rest.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Jogging.Rest.Controllers;

#if ProducesConsumes
        [Produces(MediaTypeNames.Application.Json)]
        [Consumes(MediaTypeNames.Application.Json)]
#endif

[Route("api/[controller]")]
[ApiController]
public class RankingController : ControllerBaseExtension
{
    private readonly IMapper _mapper;
    private readonly ILogger<RankingController> _logger;
    private readonly RankingManager _rankingManager;

    public RankingController(IMapper mapper, ILogger<RankingController> logger, RankingManager rankingManager)
    {
        _mapper = mapper;
        _logger = logger;
        _rankingManager = rankingManager;
    }

    #region GET

    #region GetAll

    [HttpGet]
    public async Task<ActionResult<List<Dictionary<string, List<RankingDom>>>>> GetAll([FromQuery] QueryStringParameters parameters)
    {
        try
        {
            var rankings = await _rankingManager.GetAllRankings(parameters);
            
            return Ok(rankings);
        }
        catch (ResultException)
        {
            return NotFound();
        }
        catch (Exception exception)
        {
            return InternalServerError(exception, _logger);
        }
    }

    #endregion

    #endregion
}
using AutoMapper;
using Jogging.Domain.DomainManagers;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Models;
using Jogging.Rest.Utils;
using Jogging.Rest.DTOs.ResultDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Jogging.Rest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
#if ProducesConsumes
    [Produces(MediaTypeNames.Application.Json)]
    [Consumes(MediaTypeNames.Application.Json)]
#endif
    public class ResultController : ControllerBaseExtension
    {
        #region Props

        private readonly ResultManager _resultManager;
        private readonly IMapper _mapper;
        private readonly ILogger<ResultController> _logger;

        #endregion

        #region CTor

        public ResultController(ResultManager resultManager, IMapper mapper, ILogger<ResultController> logger)
        {
            _resultManager = resultManager;
            _mapper = mapper;
            _logger = logger;
        }

        #endregion

        #region GET

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<PagedList<ResultResponseDTO>>> GetPersonResults([FromQuery] QueryStringParameters parameters)
        {
            try
            {
                var personId = JwtTokenUtil.GetUserIdFromToken(HttpContext);
                var results = await _resultManager.GetPersonResults(parameters, personId);

                ControllerUtil.AddPagination(results, Response);

                return Ok(_mapper.Map<PagedList<ResultDom>, PagedList<ResultResponseDTO>>(results));
            }
            catch (Exception ex) when (ex is ResultException)
            {
                return NotFound(ex.Message);
            }
            catch (Exception exception)
            {
                return InternalServerError(exception, _logger);
            }
        }

        [HttpGet("{competitionId:int}")]
        public async Task<ActionResult<PagedList<ResultResponseDTO>>> GetCompetitionResults(int competitionId,
            [FromQuery] QueryStringParameters parameters,
            [FromQuery] char? gender, 
            [FromQuery] string? ageCategory, 
            [FromQuery] string? distanceName)
        {
            try
            {
                var competitionResults = await _resultManager.GetCompetitionResults(parameters, competitionId, gender, ageCategory, distanceName);

                ControllerUtil.AddPagination(competitionResults, Response);

                return Ok(_mapper.Map<PagedList<ResultDom>, PagedList<ResultResponseDTO>>(competitionResults));
            }
            catch (Exception ex) when (ex is ResultException)
            {
                return NoContent();
            }
            catch (Exception exception)
            {
                return InternalServerError(exception, _logger);
            }
        }

        #endregion

        #region POST

        [HttpPost("{competitionId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Post(int competitionId, [FromForm] CompetitionResultRequestDTO competitionResultRequestDto)
        {
            try
            {
                await _resultManager.BulkUpdateResultsAsync(competitionId, _mapper.Map<ResultDom>(competitionResultRequestDto));

                return Created("Successfully uploaded results.");
            }
            catch (Exception exception)
            {
                return InternalServerError(exception, _logger);
            }
        }

        #endregion

        #region PUT

        [HttpPut("runtime/{registrationId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRunTimeAsync(int registrationId, [FromBody] ResultRuntimeRequestDto resultRequestDto)
        {
            try
            {
                await _resultManager.UpdateRunTimeAsync(registrationId, _mapper.Map<ResultDom>(resultRequestDto));

                return Created("Result updated");
            }
            catch (Exception exception)
            {
                return InternalServerError(exception, _logger);
            }
        }

        [HttpPut("guntime/{competitionId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateGunTime(int competitionId, [FromBody] ResultGunTimeRequestDto resultGunTimeRequestDto)
        {
            try
            {
                await _resultManager.UpdateGunTime(competitionId, resultGunTimeRequestDto.GunTime);

                return Created("Guntime updated");
            }
            catch (Exception exception)
            {
                return InternalServerError(exception, _logger);
            }
        }

        #endregion
    }
}
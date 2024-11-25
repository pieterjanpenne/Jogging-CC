using AutoMapper;
using Jogging.Domain.DomainManagers;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Models;
using Jogging.Rest.DTOs.CompetitionDtos;
using Jogging.Rest.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Jogging.Rest.Controllers
{
#if ProducesConsumes
    [Produces(MediaTypeNames.Application.Json)]
    [Consumes(MediaTypeNames.Application.Json)]
#endif
    [Route("api/[controller]")]
    [ApiController]
    public class CompetitionController : ControllerBaseExtension
    {
        #region Props

        private readonly CompetitionManager _competitionManager;
        private readonly IMapper _mapper;
        private readonly ILogger<CompetitionController> _logger;

        #endregion Props

        #region CTor

        public CompetitionController(CompetitionManager competitionManager, IMapper mapper, ILogger<CompetitionController> logger)
        {
            _competitionManager = competitionManager;
            _mapper = mapper;
            _logger = logger;
        }

        #endregion CTor

        #region GET

        [HttpGet]
        public async Task<ActionResult<PagedList<CompetitionResponseDTO>>> GetAllPublic(
            [FromQuery] QueryStringParameters parameters,
            [FromQuery] string? searchValue,
            [FromQuery] DateOnly? startDate,
            [FromQuery] DateOnly? endDate)
        {
            try
            {
                var competitions = await _competitionManager.GetAll(parameters, true, searchValue, startDate, endDate);

                ControllerUtil.AddPagination(competitions, Response);

                return Ok(_mapper.Map<PagedList<CompetitionDom>, PagedList<CompetitionResponseDTO>>(competitions));
            }
            catch (Exception ex) when (ex is CompetitionException)
            {
                return NotFound(ex.Message);
            }
            catch (Exception exception)
            {
                return InternalServerError(exception, _logger);
            }
        }

        [HttpGet("private")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PagedList<CompetitionResponseDTO>>> GetAllPrivate(
            [FromQuery] QueryStringParameters parameters,
            [FromQuery] string? searchValue,
            [FromQuery] DateOnly? startDate,
            [FromQuery] DateOnly? endDate)
        {
            try
            {
                var competitions = await _competitionManager.GetAll(parameters, false, searchValue, startDate, endDate);

                ControllerUtil.AddPagination(competitions, Response);

                return Ok(_mapper.Map<PagedList<CompetitionDom>, PagedList<CompetitionResponseDTO>>(competitions));
            }
            catch (Exception ex) when (ex is CompetitionException)
            {
                return NotFound(ex.Message);
            }
            catch (Exception exception)
            {
                return InternalServerError(exception, _logger);
            }
        }

        [HttpGet("{competitionId:int}")]
        public async Task<ActionResult<CompetitionResponseDTO>> Get(int competitionId)
        {
            try
            {
                var response = await _competitionManager.GetById(competitionId);

                return Ok(_mapper.Map<CompetitionResponseDTO>(response));
            }
            catch (Exception ex) when (ex is CompetitionException)
            {
                return NotFound(ex.Message);
            }
            catch (Exception exception)
            {
                return InternalServerError(exception, _logger);
            }
        }

        #endregion GET

        #region POST

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CompetitionResponseDTO>> Post(
            [FromBody] CompetitionRequestDTO competitionRequestDto)
        {
            try
            {
                var response = await _competitionManager.AddAsync(_mapper.Map<CompetitionDom>(competitionRequestDto));

                if (response != null)
                {
                    return Created(_mapper.Map<CompetitionResponseDTO>(response));
                }

                return InternalServerError(new Exception("Failed to add competition. Check your input data."), _logger);
            }
            catch (DistanceException exception)
            {
                return Conflict(exception.Message);
            }
            catch (Exception exception)
            {
                return InternalServerError(exception, _logger);
            }
        }

        #endregion POST

        #region PUT

        [HttpPut("{competitionId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CompetitionResponseDTO>> Put(int competitionId,
            [FromBody] CompetitionRequestDTO competitionRequestDto)
        {
            try
            {
                var response = await _competitionManager.UpdateAsync(competitionId,
                    _mapper.Map<CompetitionDom>(competitionRequestDto));

                if (response != null)
                {
                    return Created(_mapper.Map<CompetitionResponseDTO>(response));
                }

                return InternalServerError(new Exception("Failed to update competition. Check your input data."), _logger);
            }
            catch (DistanceException exception)
            {
                return Conflict(exception.Message);
            }
            catch (Exception exception)
            {
                return InternalServerError(exception, _logger);
            }
        }

        #endregion PUT

        #region DELETE

        [HttpDelete("{competitionId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(int competitionId)
        {
            try
            {
                await _competitionManager.DeleteAsync(competitionId);

                return Ok();
            }
            catch (Exception exception)
            {
                return InternalServerError(exception, _logger);
            }
        }

        #endregion DELETE
    }
}
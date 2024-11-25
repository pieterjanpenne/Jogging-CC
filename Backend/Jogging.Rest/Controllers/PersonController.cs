using AutoMapper;
using Jogging.Domain.DomainManagers;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Interfaces;
using Jogging.Domain.Interfaces.ServiceInterfaces;
using Jogging.Domain.Models;
using Jogging.Rest.DTOs.PersonDtos;
using Jogging.Rest.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    public class PersonController : ControllerBaseExtension
    {
        #region Props

        private readonly PersonManager _personManager;
        private readonly AuthManager _authManager;
        private readonly IMapper _mapper;
        private readonly ILogger<PersonController> _logger;
        private readonly ITokenBlacklistService _tokenBlacklistService;
        private readonly ICookieService _cookieService;

        #endregion Props

        #region CTor

        public PersonController(PersonManager personManager, IMapper mapper, ILogger<PersonController> logger,
            ITokenBlacklistService tokenBlacklistService, ICookieService cookieService, AuthManager authManager)
        {
            _personManager = personManager;
            _mapper = mapper;
            _logger = logger;
            _tokenBlacklistService = tokenBlacklistService;
            _cookieService = cookieService;
            _authManager = authManager;
        }

        #endregion CTor

        #region GET

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<PagedList<PersonResponseDTO>>> GetAll(
            [FromQuery] QueryStringParameters parameters, [FromQuery] string? searchValue)
        {
            try
            {
                var persons = await _personManager.GetAllAsync(parameters, searchValue);

                ControllerUtil.AddPagination(persons, Response);

                return Ok(_mapper.Map<PagedList<PersonDom>, PagedList<PersonResponseDTO>>(persons));
            }
            catch (Exception ex) when (ex is PersonException or PersonNotFoundException)
            {
                return NotFound(ex.Message);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "An error occurred in GetAll.");

                return InternalServerError(exception, _logger);
            }
        }

        [HttpGet("{personId:int}")]
        [Authorize]
        public async Task<ActionResult<PersonResponseDTO>> Get(int personId)
        {
            try
            {
                var personResponseDom = await _personManager.GetByIdAsync(personId);

                if (personResponseDom == null)
                {
                    return NotFound($"Person with id {personId} was not found");
                }

                var personDto = _mapper.Map<PersonResponseDTO>(personResponseDom);
                return Ok(personDto);
            }
            catch (Exception ex) when (ex is PersonException)
            {
                return NotFound(ex.Message);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "An error occurred in Get.");
                return InternalServerError(exception, _logger);
            }
        }

        #endregion GET

        #region DELETE

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeletePerson()
        {
            try
            {
                int personId = JwtTokenUtil.GetUserIdFromToken(HttpContext);
                await _personManager.DeletePersonAsync(personId);
                string token = JwtTokenUtil.GetTokenFromCookie(HttpContext);

                _tokenBlacklistService.AddToBlacklist(token);
                _cookieService.RemoveJwtCookie(Response, Request);

                return Ok("Removed account successfully");
            }
            catch (PersonNotFoundException exception)
            {
                return NotFound(exception.Message);
            }
            catch (Exception exception)
            {
                return InternalServerError(exception, _logger);
            }
        }

        [HttpDelete("private/{personId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePerson(int personId)
        {
            try
            {
                await _personManager.DeletePersonAsync(personId);

                return Ok("Removed account successfully");
            }
            catch (PersonNotFoundException exception)
            {
                return NotFound(exception.Message);
            }
            catch (Exception exception)
            {
                return InternalServerError(exception, _logger);
            }
        }

        #endregion

        #region POST

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PersonResponseDTO>>? CreatePerson([FromBody] PersonRequestDTO person)
        {
            try
            {
                var createdPerson = await _personManager.CreatePersonAsync(_mapper.Map<PersonDom>(person));

                var createdPersonDto = _mapper.Map<PersonResponseDTO>(createdPerson);
                return Created(createdPersonDto);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "An error occurred in Post.");

                return InternalServerError(exception, _logger);
            }
        }

        #endregion PUT

        #region PUT

        [HttpPut("{personId:int}")]
        [Authorize]
        public async Task<ActionResult<PersonResponseDTO>> UpdatePerson(int personId, [FromBody] PersonRequestDTO personRequestDto)
        {
            try
            {
                var updatedPerson = await _personManager.UpdatePersonAsync(personId, _mapper.Map<PersonDom>(personRequestDto));

                var createdPersonDto = _mapper.Map<PersonResponseDTO>(updatedPerson);
                return Created(createdPersonDto);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "An error occurred in Post.");

                return InternalServerError(exception, _logger);
            }
        }
        [HttpPut("email/{personId:int}")]
        [Authorize]
        public async Task<ActionResult<PersonResponseDTO>> UpdatePersonEmail(int personId, [FromBody] PersonEmailChangeRequestDto personEmailChangeRequestDto)
        {
            try
            {
                var updatedPerson = await _authManager.UpdatePersonEmailAsync(personId, _mapper.Map<PersonDom>(personEmailChangeRequestDto));

                return Created(_mapper.Map<PersonResponseDTO>(updatedPerson));
            }
            catch (DuplicateEmailException exception)
            {
                return Conflict(exception.Message);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "An error occurred in Post.");

                return InternalServerError(exception, _logger);
            }
        }

        #endregion PUT
    }
}
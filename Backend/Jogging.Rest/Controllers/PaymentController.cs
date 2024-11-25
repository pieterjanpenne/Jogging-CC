using AutoMapper;
using Jogging.Domain.DomainManagers;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Models;
using Jogging.Rest.DTOs;
using Jogging.Rest.DTOs.PaymentDtos;
using Jogging.Rest.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Jogging.Rest.Controllers;

[Route("api/[controller]")]
[ApiController]
#if ProducesConsumes
    [Produces(MediaTypeNames.Application.Json)]
    [Consumes(MediaTypeNames.Application.Json)]
#endif
public class PaymentController : ControllerBaseExtension
{
    private readonly PaymentManager _paymentManager;
    private readonly IMapper _mapper;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(PaymentManager paymentManager, IMapper mapper, ILogger<PaymentController> logger)
    {
        _paymentManager = paymentManager;
        _mapper = mapper;
        _logger = logger;
    }

    #region POST

    [HttpPost("{competitionId}")]
    [Authorize]
    public async Task<IActionResult> Post(int competitionId)
    {
        try
        {
            var personId = JwtTokenUtil.GetUserIdFromToken(HttpContext);
            var paymentUrl = await _paymentManager.CreatePaymentUrl(personId, competitionId);
            return Created(paymentUrl);
        }
        catch (RegistrationNotFoundException exception)
        {
            return NotFound(exception.Message);
        }
        catch (PaymentException exception)
        {
            return Conflict(exception.Message);
        }
        catch (Exception exception)
        {
            return InternalServerError(exception, _logger);
        }
    }

    [HttpPost("notify")]
    public async Task<IActionResult> PaymentNotification([FromQuery] PaymentNotificationDTO notificationDto)
    {
        try
        {
            await _paymentManager.ProcessPaymentNotification(_mapper.Map<PaymentNotificationDom>(notificationDto));

            return Created("OK");
        }
        catch (Exception exception)
        {
            return InternalServerError(exception, _logger);
        }
    }

    #endregion
}
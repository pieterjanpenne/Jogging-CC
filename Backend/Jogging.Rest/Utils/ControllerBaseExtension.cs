using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Jogging.Rest.Utils;

public abstract class ControllerBaseExtension : ControllerBase
{
    [NonAction]
    protected ObjectResult InternalServerError(Exception exception, ILogger logger)
    {
        string error = exception?.Message ?? "Something went wrong";
        string stackTrace = exception?.StackTrace ?? "";
        var errorMessage = $"{error}\n{stackTrace}";
        logger.LogError(errorMessage);
        return StatusCode(StatusCodes.Status500InternalServerError, exception?.Message ?? "Something went wrong");
    }
    
    [NonAction]
    protected ObjectResult Created<T>(T response)
    {
        return StatusCode(StatusCodes.Status201Created, response);
    }    
    [NonAction]
    protected StatusCodeResult Created()
    {
        return StatusCode(StatusCodes.Status201Created);
    }
}
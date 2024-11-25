using Jogging.Domain.Interfaces.ServiceInterfaces;
using Microsoft.AspNetCore.Http;

namespace Jogging.Domain.Services;

public class CookieService : ICookieService
{
    private CookieOptions GetCookieOptions(HttpRequest request)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(30)
        };

        // Check if the request is HTTPS
        if (request.IsHttps)
        {
            cookieOptions.SameSite = SameSiteMode.None; // Allows cross-site usage
            cookieOptions.Secure = true; // Required with SameSite=None
        }
        else
        {
            cookieOptions.SameSite = SameSiteMode.Lax; // More lenient for local development
            cookieOptions.Secure = false;
        }

        return cookieOptions;
    }
    public void AddJwtCookie(HttpResponse response, HttpRequest request, string jwtToken)
    {
        response.Cookies.Append("X-Access-Token", jwtToken, GetCookieOptions(request));
    }

    public void RemoveJwtCookie(HttpResponse response, HttpRequest request)
    {
        response.Cookies.Delete("X-Access-Token", GetCookieOptions(request));
    }
}
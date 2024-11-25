using Microsoft.AspNetCore.Http;

namespace Jogging.Domain.Interfaces.ServiceInterfaces;

public interface ICookieService
{
    void RemoveJwtCookie(HttpResponse response, HttpRequest request);
    void AddJwtCookie(HttpResponse response, HttpRequest request, string jwtToken);
}
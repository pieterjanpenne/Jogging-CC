using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;
using Jogging.Domain.Interfaces;
using Jogging.Domain.Interfaces.ServiceInterfaces;
using Microsoft.IdentityModel.Tokens;

namespace Jogging.Api.Configuration
{
    public class JwtTokenValidationMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtTokenValidationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (!string.IsNullOrEmpty(token))
            {
                var tokenBlacklistService = context.RequestServices.GetRequiredService<ITokenBlacklistService>();

                if (tokenBlacklistService.IsTokenBlacklisted(token))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return;
                }
            }

            await _next(context);
        }
    }
}
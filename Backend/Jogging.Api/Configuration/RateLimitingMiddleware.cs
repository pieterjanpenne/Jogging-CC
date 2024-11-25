using Jogging.Domain.Helpers;
using Jogging.Rest.Utils;
using Microsoft.Extensions.Caching.Memory;

namespace Jogging.Api.Configuration;

public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly CustomMemoryCache _cache;
    private readonly string _endpoint;
    private readonly TimeSpan _expirationTime = TimeSpan.FromMinutes(5);
    public RateLimitingMiddleware(RequestDelegate next, string endpoint, CustomMemoryCache cache)
    {
        _next = next;
        _endpoint = endpoint;
        _cache = cache;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments(_endpoint, StringComparison.OrdinalIgnoreCase))
        {
            string userRole = JwtTokenUtil.GetRoleFromToken(context);

            if (userRole.ToLower() == "admin")
            {
                await _next(context);
                return;
            }

            var ipAddress = context.Connection.RemoteIpAddress?.ToString();
        
            if (!string.IsNullOrEmpty(ipAddress))
            {
                var cacheKey = $"{_endpoint}:{ipAddress}";
            
                var requestCount = _cache.GetOrCreate<int>(cacheKey, entry =>
                {
                    entry.AbsoluteExpirationRelativeToNow = _expirationTime;
                    entry.SetPriority(CacheItemPriority.NeverRemove);
                    return 0;
                });

                if (requestCount < 1)
                {
                    _cache.Set(cacheKey, requestCount + 1, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = _expirationTime
                    });

                    await _next(context);
                }
                else
                {
                    context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    return;
                }
            }
            else
            {
                await _next(context);
            }
        }
        else
        {
            await _next(context);
        }
    }

}
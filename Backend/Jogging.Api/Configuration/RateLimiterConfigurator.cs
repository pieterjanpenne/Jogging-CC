using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace Jogging.Api.Configuration;

public class RateLimiterConfigurator
{
    public static void ConfigureRateLimiter(RateLimiterOptions options)
    {
        options.GlobalLimiter = PartitionedRateLimiter.CreateChained(
            PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(), partition =>
                    new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 600,
                        Window = TimeSpan.FromMinutes(1)
                    })),
            PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(), partition =>
                    new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 6000,
                        Window = TimeSpan.FromHours(1)
                    })));

        options.OnRejected = async (context, token) =>
        {
            context.HttpContext.Response.StatusCode = 429;
            if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
            {
                await context.HttpContext.Response.WriteAsync(
                    $"Too many requests. Please try again after {retryAfter.TotalMinutes} minute(s).", cancellationToken: token);
            }
            else
            {
                await context.HttpContext.Response.WriteAsync(
                    "Too many requests. Please try again later.", cancellationToken: token);
            }
        };
    }
}
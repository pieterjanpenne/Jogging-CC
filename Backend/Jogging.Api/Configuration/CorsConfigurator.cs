using Microsoft.AspNetCore.Cors.Infrastructure;

namespace Jogging.Api.Configuration;

public class CorsConfigurator
{
    public static void ConfigureCors(CorsOptions options)
    {
        options.AddPolicy("AllowAny",
            builder =>
            {
                builder.WithOrigins("http://20.56.159.69:50545", "http://localhost:5173", "https://localhost:5173")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                    .WithExposedHeaders("X-Pagination");
            });
    }
}

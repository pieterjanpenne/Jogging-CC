namespace Jogging.Api.Configuration
{
    public static class HelmetConfig
    {
        private static Dictionary<string, string> headers = new Dictionary<string, string>() {
            {"X-Frame-Options", "DENY" },
            {"X-Xss-Protection", "1; mode=block"},
            {"X-Content-Type-Options", "nosniff"},
            {"Referrer-Policy", "no-referrer"},
            {"X-Permitted-Cross-Domain-Policies", "none"},
            {"Permissions-Policy", "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"},
            {"Content-Security-Policy", "default-src 'self'"}
        };

        public static void AddXFrameSupress(this IServiceCollection services)
        {
            services.AddAntiforgery(options =>
            {
                options.SuppressXFrameOptionsHeader = true;
            });
        }

        public static void AddHsts(WebApplication app, WebApplicationBuilder builder)
        {
            if (!builder.Environment.IsDevelopment())
            {
                app.UseHsts();
            }
        }

        public static void UseHelmetHeaders(this WebApplication app)
        {
            app.Use(async (context, next) =>
            {
                foreach (var keyvalue in headers)
                {
                    if (!context.Response.Headers.ContainsKey(keyvalue.Key))
                    {
                        context.Response.Headers.Add(keyvalue.Key, keyvalue.Value);
                    }
                }
                await next(context);
            });
        }
    }
}
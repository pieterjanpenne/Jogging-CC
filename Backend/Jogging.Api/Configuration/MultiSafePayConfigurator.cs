using Jogging.Domain.Configuration;
using MultiSafepay;

namespace Jogging.Api.Configuration;

public static class MultiSafePayConfigurator
{
    public static void AddMultiSafepay(this IServiceCollection services, IConfiguration configuration)
    {
        var multiSafepayConfiguration = configuration.GetSection("MultiSafepay").Get<MultiSafepayConfiguration>();
        
        if (multiSafepayConfiguration == null)
        {
            throw new InvalidOperationException("Multi safe pay configuration is missing.");
        }
        
        var client = new MultiSafepayClient(multiSafepayConfiguration.ApiKey, multiSafepayConfiguration.ApiUrl);
        services.AddScoped(_ => client);
    }
}
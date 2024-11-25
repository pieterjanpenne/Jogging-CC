using Jogging.Domain.Models;
using Microsoft.Extensions.Caching.Memory;

namespace Jogging.Domain.Helpers;

public class CachingHelper
{
    private readonly CustomMemoryCache _memoryCache;

    private readonly MemoryCacheEntryOptions _options = new()
    {
        AbsoluteExpirationRelativeToNow =
            TimeSpan.FromMilliseconds(24 * 60 * 60 * 1000)
    };
    
    public CachingHelper(CustomMemoryCache memoryCache)
    {
        _memoryCache = memoryCache;
    }

    public async Task<T> GetOrSetAsync<T>(string cacheKey, Func<Task<T>> getDataFunc)
    {
        if (_memoryCache.TryGetValue(cacheKey, out var cacheObject))
        {
            if (cacheObject is T cachedResults)
            {
                return cachedResults;
            }
        }

        var data = await getDataFunc();
        _memoryCache.Set(cacheKey, data, _options);

        return data;
    }
}
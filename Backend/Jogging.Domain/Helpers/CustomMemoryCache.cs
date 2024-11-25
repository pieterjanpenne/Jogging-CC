using System.Collections.Concurrent;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Caching.Memory;

namespace Jogging.Domain.Helpers;

public class CustomMemoryCache : IMemoryCache
{
    private readonly IMemoryCache _memoryCache;
    private readonly ConcurrentDictionary<string, byte> _keys;

    public CustomMemoryCache(IMemoryCache memoryCache)
    {
        _memoryCache = memoryCache ?? throw new ArgumentNullException(nameof(memoryCache));
        _keys = new ConcurrentDictionary<string, byte>();
    }

    public bool TryGetValue(object key, out object value)
    {
        return _memoryCache.TryGetValue(key, out value);
    }

    public ICacheEntry CreateEntry(object key)
    {
        var entry = _memoryCache.CreateEntry(key);
        _keys.TryAdd(key.ToString(), 0);
        entry.RegisterPostEvictionCallback((k, v, r, s) => _keys.TryRemove(k.ToString(), out _));
        return entry;
    }

    public void Remove(object key)
    {
        _memoryCache.Remove(key);
        _keys.TryRemove(key.ToString(), out _);
    }

    public void Dispose()
    {
        _memoryCache.Dispose();
    }

    public IEnumerable<string> GetAllKeys()
    {
        return _keys.Keys;
    }

    public void RemoveKeysWithPattern(string pattern)
    {
        var regex = new Regex(pattern);
        var keysToRemove = _keys.Keys.Where(k => regex.IsMatch(k)).ToList();
        foreach (var key in keysToRemove)
        {
            Remove(key);
        }
    }
}
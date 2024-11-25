using Jogging.Domain.Interfaces.ServiceInterfaces;

namespace Jogging.Domain.Services;

public class TokenBlacklistService : ITokenBlacklistService
{
    private readonly HashSet<string> _blacklist;

    public TokenBlacklistService()
    {
        _blacklist = new HashSet<string>();
    }

    public void AddToBlacklist(string token)
    {
        _blacklist.Add(token);
    }

    public bool IsTokenBlacklisted(string token)
    {
        return _blacklist.Contains(token);
    }
}
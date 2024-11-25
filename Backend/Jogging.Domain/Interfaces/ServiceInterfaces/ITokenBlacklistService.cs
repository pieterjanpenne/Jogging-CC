namespace Jogging.Domain.Interfaces.ServiceInterfaces;

public interface ITokenBlacklistService
{
    void AddToBlacklist(string token);
    bool IsTokenBlacklisted(string token);
}
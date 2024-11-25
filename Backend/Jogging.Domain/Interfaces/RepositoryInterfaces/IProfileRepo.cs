using Jogging.Domain.Models;

namespace Jogging.Domain.Interfaces.RepositoryInterfaces;

public interface IProfileRepo
{
    public Task UpdateAsync(string userId, ProfileDom updatedItem);
}
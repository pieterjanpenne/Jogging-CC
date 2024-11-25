using Jogging.Domain.Models;

namespace Jogging.Domain.Interfaces.RepositoryInterfaces;

public interface IAgeCategoryRepo : IGenericRepo<AgeCategoryDom>
{
    public Task<AgeCategoryDom> GetAgeCategoryByAge(PersonDom person);
}
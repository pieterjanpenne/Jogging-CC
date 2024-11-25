using Jogging.Domain.Models;

namespace Jogging.Domain.Interfaces.RepositoryInterfaces;

public interface IPersonRepo : IGenericRepo<PersonDom>
{
    public new Task<(PersonDom, PersonDom, bool shouldSendEmail)> UpdateAsync(int personId, PersonDom updatedPerson);
    public Task UpdatePersonEmailAsync(int personId, PersonDom updatedPerson);
    public Task<PersonDom?> GetByGuidAsync(string userId);
    public Task<List<PersonDom>> GetBySearchValueAsync(string searchValue);
    public Task<PersonDom> GetByEmailAsync(string email);
}
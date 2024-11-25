using Jogging.Domain.Models;

namespace Jogging.Domain.Interfaces.RepositoryInterfaces
{
    public interface IRegistrationRepo : IGenericRepo<RegistrationDom>
    {
        public Task<RegistrationDom> SignInToContestAsync(int competitionId, PersonDom person, string distanceName);
        public Task<RegistrationDom> GetRegistrationByPersonIdAndCompetitionIdAsync(int personId, int competitionId, bool throwError = true);

        public Task<List<RegistrationDom>> GetByPersonIdAndCompetitionIdAsync(int personId, int competitionId, bool withRunNumber,
            bool throwError = true);

        public Task<List<RegistrationDom>> GetByPersonIdAsync(int personId, bool withRunNumber);
        public Task<List<RegistrationDom>> GetByCompetitionIdAsync(int competitionId, bool withRunNumber);
        public Task DeleteByPersonIdAndCompetitionIdAsync(int personId, int competitionId);
        
        public Task<List<RegistrationDom>> GetAllAsync(bool withRunNumber);
        public Task<List<RegistrationDom>> GetByCompetitionIdAndSearchValueAsync(int competitionId, string searchValue, bool withRunNumber);

        public Task<RegistrationDom> UpdateRunNumberAsync(int registrationId, RegistrationDom updatedItem);
        public Task<RegistrationDom> UpdatePaidAsync(int registrationId, RegistrationDom updatedItem);
        public Task<RegistrationDom> UpdateCompetitionPerCategoryAsync(int registrationId, int personId, CompetitionPerCategoryDom competitionPerCategoryDom);
    }
}
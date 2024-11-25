using AutoMapper;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Infrastructure.Models.DatabaseModels.Competition;
using Jogging.Infrastructure.Models.DatabaseModels.Registration;
using Jogging.Infrastructure.Models.SearchModels.Registration;
using Microsoft.Extensions.Caching.Memory;
using Postgrest;
using Client = Supabase.Client;

namespace Jogging.Infrastructure.Repositories.SupabaseRepos
{
    public class RegistrationRepo : IRegistrationRepo
    {
        private readonly Client _client;
        private readonly IAgeCategoryRepo _ageCategoryRepo;
        private readonly IPersonRepo _personRepo;
        private readonly ICompetitionPerCategoryRepo _competitionPerCategoryRepo;
        private readonly ICompetitionRepo _competitionRepo;
        private readonly IMapper _mapper;
        private readonly CustomMemoryCache _memoryCache;

        public RegistrationRepo(Client client, IAgeCategoryRepo ageCategoryRepo,
            ICompetitionPerCategoryRepo competitionPerCategoryRepo, IMapper mapper, CustomMemoryCache memoryCache, ICompetitionRepo competitionRepo,
            IPersonRepo personRepo)
        {
            _client = client;
            _ageCategoryRepo = ageCategoryRepo;
            _competitionPerCategoryRepo = competitionPerCategoryRepo;
            _mapper = mapper;
            _memoryCache = memoryCache;
            _competitionRepo = competitionRepo;
            _personRepo = personRepo;
        }

        #region GetRegistrationByPersonIdAndCompetitionIdAsync

        public async Task<RegistrationDom> GetRegistrationByPersonIdAndCompetitionIdAsync(int personId, int competitionId, bool throwError = true)
        {
            var personRegistration = await _client.From<PersonRegistration>()
                .Where(pr => pr.PersonId == personId)
                .Where(pr => pr.CompetitionId == competitionId)
                .Limit(1)
                .Single();

            if (throwError && personRegistration == null)
            {
                throw new RegistrationNotFoundException("Registration not found");
            }

            return _mapper.Map<RegistrationDom>(personRegistration);
        }

        #endregion

        #region GetAllAsync

        public async Task<List<RegistrationDom>> GetAllAsync()
        {
            var result = await _client.From<ExtendedRegistration>()
                .Get();

            if (result.Models.Count <= 0)
            {
                throw new RegistrationNotFoundException("No registrations found");
            }

            return _mapper.Map<List<RegistrationDom>>(result.Models);
        }

        #endregion

        #region GetAllAsync (withRunNumber)

        public async Task<List<RegistrationDom>> GetAllAsync(bool withRunNumber)
        {
            var registrations = await _client.From<ExtendedRegistration>()
                .Where(p => p.RunNumber != null)
                .Get();

            if (registrations.Models.Count <= 0)
            {
                throw new RegistrationNotFoundException("No registrations found");
            }

            return _mapper.Map<List<RegistrationDom>>(registrations.Models);
        }

        #endregion

        #region GetRegistrationByAndCompetitionIdAndSearchValueAsync

        public async Task<List<RegistrationDom>> GetByCompetitionIdAndSearchValueAsync(int competitionId, string searchValue,
            bool withRunNumber)
        {
            var parameters = new Dictionary<string, object>
            {
                { "competitionid", competitionId },
                { "searchvalue", searchValue }
            };

            var storedProcedure = await _client.Rpc<List<ExtendedRegistrationSearchByPerson>>("get_competition_registrations", parameters);

            if (withRunNumber && storedProcedure != null)
            {
                storedProcedure = storedProcedure.Where(p => p.RunNumber != null).ToList();
            }

            if (storedProcedure == null || storedProcedure.Count == 0)
            {
                throw new RegistrationNotFoundException("No registrations found");
            }

            return _mapper.Map<List<RegistrationDom>>(storedProcedure);
        }

        #endregion

        #region GetRegistrationsByPersonIdAndCompetitionIdAsync

        public async Task<List<RegistrationDom>> GetByPersonIdAndCompetitionIdAsync(int personId, int competitionId, bool withRunNumber,
            bool throwError = true)
        {
            var query = _client.From<SimpleRegistration>()
                .Where(registration => registration.PersonId == personId)
                .Where(registration => registration.CompetitionId == competitionId);

            if (withRunNumber)
            {
                query = query.Where(p => p.RunNumber != null);
            }

            var registration = await query.Limit(1)
                .Get();

            if (throwError && registration.Models.Count == 0)
            {
                throw new RegistrationNotFoundException("No registrations found");
            }

            var mapped = _mapper.Map<List<RegistrationDom>>(registration.Models);

            return mapped;
        }

        #endregion

        #region GetRegistrationsByPersonIdAsync

        public async Task<List<RegistrationDom>> GetByPersonIdAsync(int personId, bool withRunNumber)
        {
            var query = _client.From<ExtendedRegistration>()
                .Where(r => r.PersonId == personId);

            if (withRunNumber)
            {
                query = query.Where(p => p.RunNumber != null);
            }

            var registrations = await query.Get();

            if (registrations.Models.Count <= 0)
            {
                throw new RegistrationNotFoundException("No registrations found");
            }

            return _mapper.Map<List<RegistrationDom>>(registrations.Models);
        }

        #endregion

        #region GetRegistrationsByCompetitionIdAsync

        public async Task<List<RegistrationDom>> GetByCompetitionIdAsync(int competitionId, bool withRunNumber)
        {
            var query = _client.From<ExtendedRegistration>()
                .Where(r => r.CompetitionId == competitionId);

            if (withRunNumber)
            {
                query = query.Where(p => p.RunNumber != null);
            }

            var registrations = await query.Get();

            if (registrations.Models.Count <= 0)
            {
                throw new RegistrationNotFoundException("No registrations found");
            }

            return _mapper.Map<List<RegistrationDom>>(registrations.Models);
        }

        #endregion

        #region DeleteByPersonIdAndCompetitionIdAsync

        public async Task DeleteByPersonIdAndCompetitionIdAsync(int personId, int competitionId)
        {
            await _client.From<SimpleRegistration>()
                .Where(registration => registration.PersonId == personId)
                .Where(registration => registration.CompetitionId == competitionId)
                .Delete();
        }

        #endregion

        #region DeleteAsync

        public async Task DeleteAsync(int registrationId)
        {
            await _client.From<SimpleRegistration>()
                .Where(c => c.Id == registrationId)
                .Delete();
        }

        #endregion

        #region GetByIdAsync

        public async Task<RegistrationDom> GetByIdAsync(int registrationId)
        {
            var registration = await GetSimpleRegistrationByIdAsync(registrationId);

            if (registration == null)
            {
                throw new RegistrationNotFoundException("Registration not found");
            }

            return _mapper.Map<RegistrationDom>(registration);
        }

        #endregion

        #region SignInToContestAsync

        public async Task<RegistrationDom> SignInToContestAsync(int competitionId, PersonDom person, string distanceName)
        {
            await CheckDuplicateRegistration(person.Id, competitionId);
            CompetitionDom competition = await _competitionRepo.GetSimpleCompetitionByIdAsync(competitionId);
            AgeCategoryDom ageCategory = await _ageCategoryRepo.GetAgeCategoryByAge(person);
            CompetitionPerCategoryDom competitionPerCategory =
                await _competitionPerCategoryRepo.GetCompetitionPerCategoryByParameters(ageCategory.Id, distanceName, person.Gender, competitionId);

            SimpleRegistration registration = new SimpleRegistration
                { CompetitionPerCategoryId = competitionPerCategory.Id, Paid = false, PersonId = person.Id, CompetitionId = competitionId };

            var performedRegistration = await _client.From<SimpleRegistration>()
                .Insert(registration);

            if (performedRegistration.Model == null)
            {
                throw new PersonRegistrationException("Something went wrong doing your registration");
            }
            
            return new RegistrationDom()
            {
                Id = performedRegistration.Model.Id,
                PersonId = person.Id,
                Person =person,
                CompetitionId = competitionId,
                Competition = competition,
                CompetitionPerCategoryId = competitionPerCategory.Id,
                CompetitionPerCategory = competitionPerCategory,
                Paid = false,
            };
        }

        #endregion

        #region UpdateAsync

        public async Task<RegistrationDom> UpdateAsync(int registrationId, RegistrationDom updatedItem)
        {
            var oldRegistration = await GetSimpleRegistrationByIdAsync(registrationId);

            if (oldRegistration == null)
            {
                throw new RegistrationNotFoundException("Registration not found");
            }

            if (updatedItem.RunNumber != null)
            {
                var runNumber = updatedItem.RunNumber == -1 ? null : updatedItem.RunNumber;
                oldRegistration.RunNumber = runNumber;
            }

            if (updatedItem.Paid != null)
            {
                oldRegistration.Paid = updatedItem.Paid;
            }

            await oldRegistration
                .Update<SimpleRegistration>();

            return _mapper.Map<RegistrationDom>(oldRegistration);
        }

        #endregion

        #region UpdateRunNumberAsync

        public async Task<RegistrationDom> UpdateRunNumberAsync(int registrationId, RegistrationDom updatedItem)
        {
            var oldRegistration = await GetSimpleRegistrationByIdAsync(registrationId);

            if (oldRegistration == null)
            {
                throw new RegistrationNotFoundException("Registration not found");
            }

            var runNumber = updatedItem.RunNumber == -1 ? null : updatedItem.RunNumber;
            oldRegistration.RunNumber = runNumber;

            await oldRegistration
                .Update<SimpleRegistration>();

            return _mapper.Map<RegistrationDom>(oldRegistration);
        }

        #endregion

        #region UpdatePaidAsync

        public async Task<RegistrationDom> UpdatePaidAsync(int registrationId, RegistrationDom updatedItem)
        {
            var oldRegistration = await GetSimpleRegistrationByIdAsync(registrationId);

            if (oldRegistration == null)
            {
                throw new RegistrationNotFoundException("Registration not found");
            }

            if (oldRegistration.Paid != updatedItem.Paid)
            {
                oldRegistration.Paid = updatedItem.Paid;

                await oldRegistration.Update<SimpleRegistration>();
            }

            return _mapper.Map<RegistrationDom>(oldRegistration);
        }

        #endregion

        #region UpdateCompetitionPerCategoryAsync

        public async Task<RegistrationDom> UpdateCompetitionPerCategoryAsync(int registrationId, int personId,
            CompetitionPerCategoryDom competitionPerCategory)
        {
            var oldRegistration = await GetSimpleRegistrationByIdAsync(registrationId);
            if (oldRegistration == null)
            {
                throw new RegistrationNotFoundException("Registration not found");
            }

            if (oldRegistration.PersonId != personId)
            {
                throw new PersonRegistrationException("You can't change this registration");
            }

            var person = await _personRepo.GetByIdAsync(personId);
            var ageCategory = await _ageCategoryRepo.GetAgeCategoryByAge(person);

            var newCompetitionPerCategory = await _competitionPerCategoryRepo
                .GetCompetitionPerCategoryByParameters(
                    ageCategory.Id,
                    competitionPerCategory.DistanceName,
                    person.Gender,
                    oldRegistration.CompetitionId
                );
            
            oldRegistration.CompetitionPerCategoryId = newCompetitionPerCategory.Id;

            await oldRegistration.Update<SimpleRegistration>();
            
            _memoryCache.Remove(CacheKeyGenerator.GetCompetitionResultsKey(oldRegistration.CompetitionId));
            _memoryCache.Remove(CacheKeyGenerator.GetAllResultsKey());

            return _mapper.Map<RegistrationDom>(oldRegistration);
        }

        #endregion

        #region GetSimpleRegistrationByIdAsync

        private async Task<SimpleRegistration?> GetSimpleRegistrationByIdAsync(int registrationId)
        {
            return await _client.From<SimpleRegistration>()
                .Where(c => c.Id == registrationId)
                .Limit(1)
                .Single();
        }

        #endregion

        #region CheckDuplicateRegistration

        private async Task CheckDuplicateRegistration(int personId, int competitionId)
        {
            var existingRegistrations = await _client.From<SimpleRegistration>()
                .Where(pr => pr.PersonId == personId)
                .Where(pr => pr.CompetitionId == competitionId)
                .Limit(1)
                .Single();

            if (existingRegistrations != null)
            {
                throw new RegistrationAlreadyExistsException("Deze registratie bestaat al");
            }
        }

        #endregion

        #region UpsertAsync

        public Task<RegistrationDom> UpsertAsync(int? id, RegistrationDom updatedItem)
        {
            throw new NotImplementedException();
        }

        #endregion

        #region AddAsync

        public Task<RegistrationDom> AddAsync(RegistrationDom person)
        {
            throw new NotImplementedException();
        }

        #endregion
    }
}
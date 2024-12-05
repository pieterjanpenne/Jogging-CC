using AutoMapper;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Infrastructure2.Data;
using Jogging.Infrastructure2.Models;
using Microsoft.EntityFrameworkCore;
namespace Jogging.Infrastructure.Repositories.SupabaseRepos
{
    public class RegistrationRepo : IRegistrationRepo
    {
        private readonly JoggingCcContext _context;
        private readonly IAgeCategoryRepo _ageCategoryRepo;
        private readonly IPersonRepo _personRepo;
        private readonly ICompetitionPerCategoryRepo _competitionPerCategoryRepo;
        private readonly ICompetitionRepo _competitionRepo;
        private readonly IMapper _mapper;
        private readonly CustomMemoryCache _memoryCache;

        public RegistrationRepo(JoggingCcContext context, IAgeCategoryRepo ageCategoryRepo,
            ICompetitionPerCategoryRepo competitionPerCategoryRepo, IMapper mapper, CustomMemoryCache memoryCache, ICompetitionRepo competitionRepo,
            IPersonRepo personRepo)
        {
            _context = context;
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
            var personRegistration = await _context.Registrations.FirstOrDefaultAsync(r => r.PersonId == personId && r.CompetitionId == competitionId);

            if (throwError && personRegistration == null)
            {
                throw new RegistrationNotFoundException("Registration not found");
            }

            try
            {
                return _mapper.Map<RegistrationDom>(personRegistration);
            }
            catch (Exception ex)
            {
                throw new Exception($"GetRegistrationByPersonIdAndCompetitionIdAsync: {ex.Message}");
            }
        }

        #endregion

        #region GetAllAsync

        public async Task<List<RegistrationDom>> GetAllAsync()
        {
            try
            {
                return _mapper.Map<List<RegistrationDom>>(await _context.Registrations.ToListAsync());
            }
            catch (Exception ex)
            {
                throw new Exception($"GetAllAsync: {ex.Message}");
            }
        }

        #endregion

        #region GetAllAsync (withRunNumber)

        public async Task<List<RegistrationDom>> GetAllAsync(bool withRunNumber)
        {
            try
            {
                var registrations = await _context.Registrations
                .Where(p => p.RunNumber != null).ToListAsync();

                return _mapper.Map<List<RegistrationDom>>(registrations);
            }
            catch (Exception ex)
            {
                throw new Exception($"GetAllAsync: {ex.Message}");
            }
        }

        #endregion

        #region GetRegistrationByAndCompetitionIdAndSearchValueAsync

        public async Task<List<RegistrationDom>> GetByCompetitionIdAndSearchValueAsync(int competitionId, string searchValue,
            bool withRunNumber)
        {
            // Onzeker over searchValues
            var registrationsQuery = _context.Registrations
            .Where(r => r.CompetitionId == competitionId && r.RunNumber != null)
            .AsQueryable();

            if (withRunNumber)
            {
                registrationsQuery = registrationsQuery.Where(r => r.RunNumber != null);
            }

            var registrations = await registrationsQuery.ToListAsync();

            if (registrations == null || !registrations.Any())
            {
                throw new RegistrationNotFoundException("No registrations found");
            }

            return _mapper.Map<List<RegistrationDom>>(registrations);
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
            try
            {
                _context.Remove(GetRegistrationByPersonIdAndCompetitionIdAsync(personId, competitionId));
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"DeleteByPersonIdAndCompetitionIdAsync: {ex.Message}");
            }
        }

        #endregion

        #region DeleteAsync

        public async Task DeleteAsync(int registrationId)
        {
            try
            {
                _context.Remove(GetByIdAsync(registrationId));
            }
            catch (Exception ex)
            {
                throw new Exception($"DeleteAsync: {ex.Message}");
            }
        }

        #endregion

        #region GetByIdAsync

        public async Task<RegistrationDom> GetByIdAsync(int registrationId)
        {
            try
            {
                return _mapper.Map<RegistrationDom>(_context.Registrations.FindAsync(registrationId));
            }
            catch (Exception ex)
            {
                throw new Exception($"GetByIdAsync: {ex.Message}");
            }
        }

        #endregion

        #region SignInToContestAsync

        public async Task<RegistrationDom> SignInToContestAsync(int competitionId, PersonDom person, string distanceName)
        {
            await CheckDuplicateRegistration(person.Id, competitionId);

            var competition = await _competitionRepo.GetSimpleCompetitionByIdAsync(competitionId);
            var ageCategory = await _ageCategoryRepo.GetAgeCategoryByAge(person);
            var competitionPerCategory = await _competitionPerCategoryRepo
                .GetCompetitionPerCategoryByParameters(ageCategory.Id, distanceName, person.Gender, competitionId);

            var registration = new RegistrationEF
            {
                CompetitionPerCategoryId = competitionPerCategory.Id,
                Paid = false,
                PersonId = person.Id,
                CompetitionId = competitionId
            };

            _context.Registrations.Add(registration);
            await _context.SaveChangesAsync();

            if (registration.Id == 0)
            {
                throw new PersonRegistrationException("Something went wrong doing your registration");
            }

            return _mapper.Map<RegistrationDom>(registration);
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
                oldRegistration.Paid = (bool)updatedItem.Paid;
            }

            _context.Registrations.Update(oldRegistration);
            await _context.SaveChangesAsync();

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

            _context.Registrations.Update(oldRegistration);
            await _context.SaveChangesAsync();

            return _mapper.Map<RegistrationDom>(oldRegistration);
        }

        #endregion

        #region UpdatePaidAsync

        public async Task<RegistrationDom> UpdatePaidAsync(int registrationId, RegistrationDom updatedItem)
        {
            var oldRegistration = await _context.Registrations
               .Where(r => r.Id == registrationId)
               .FirstOrDefaultAsync();

            if (oldRegistration == null)
            {
                throw new RegistrationNotFoundException("Registration not found");
            }

            if (oldRegistration.Paid != updatedItem.Paid)
            {
                oldRegistration.Paid = (bool)updatedItem.Paid;

                _context.Registrations.Update(oldRegistration);
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<RegistrationDom>(oldRegistration);
        }

        #endregion

        #region UpdateCompetitionPerCategoryAsync

        public async Task<RegistrationDom> UpdateCompetitionPerCategoryAsync(int registrationId, int personId,
            CompetitionPerCategoryDom competitionPerCategory)
        {
            var oldRegistration = await _context.Registrations
               .Where(r => r.Id == registrationId)
               .FirstOrDefaultAsync();

            var person = await _context.People
                .Where(p => p.Id == personId)
                .FirstOrDefaultAsync();

            if (oldRegistration == null)
            {
                throw new RegistrationNotFoundException("Registration not found");
            }

            if (oldRegistration.PersonId != personId)
            {
                throw new PersonRegistrationException("You can't change this registration");
            }

            if (oldRegistration.PersonId != personId)
            {
                throw new PersonRegistrationException("You can't change this registration");
            }

            var ageCategory = await _ageCategoryRepo.GetAgeCategoryByAge(_mapper.Map<PersonDom>(person));

            var newCompetitionPerCategory = await _competitionPerCategoryRepo
                .GetCompetitionPerCategoryByParameters(
                    ageCategory.Id,
                    competitionPerCategory.DistanceName,
                    person.Gender.ToCharArray()[0],
                    (int)oldRegistration.CompetitionId);

            oldRegistration.CompetitionPerCategoryId = newCompetitionPerCategory.Id;

            _context.Registrations.Update(oldRegistration);
            await _context.SaveChangesAsync();

            return _mapper.Map<RegistrationDom>(oldRegistration);

        }

        #endregion

        #region GetSimpleRegistrationByIdAsync

        private async Task<RegistrationEF?> GetSimpleRegistrationByIdAsync(int registrationId)
        {
            return await _context.Registrations
                .Where(c => c.Id == registrationId).FirstOrDefaultAsync();
        }

        #endregion

        #region CheckDuplicateRegistration

        private async Task CheckDuplicateRegistration(int personId, int competitionId)
        {
            var existingRegistrations = await _context.Registrations
                .Where(pr => pr.PersonId == personId)
                .Where(pr => pr.CompetitionId == competitionId).ToListAsync();

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
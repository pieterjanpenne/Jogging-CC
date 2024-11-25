using Jogging.Domain.Exceptions;
using Jogging.Domain.Models;
using Jogging.Domain.Helpers;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Validators;

namespace Jogging.Domain.DomainManagers
{
    public class PersonManager
    {
        private readonly IPersonRepo _personRepo;
        private readonly EmailManager _emailManager;
        private readonly CustomMemoryCache _memoryCache;

        public PersonManager(IPersonRepo personRepo, EmailManager emailManager, CustomMemoryCache memoryCache)
        {
            _personRepo = personRepo;
            _emailManager = emailManager;
            _memoryCache = memoryCache;
        }

        public async Task<PagedList<PersonDom>> GetAllAsync(QueryStringParameters parameters, string? searchValue)
        {
            List<PersonDom> persons;
            if (searchValue == null)
            {
                persons = await _personRepo.GetAllAsync();
            }
            else
            {
                persons = await _personRepo.GetBySearchValueAsync(searchValue);
            }

            if (persons == null || !persons.Any())
            {
                throw new PersonException("No persons found");
            }

            return PagedList<PersonDom>.ToPagedList(persons.AsQueryable(), parameters.PageNumber, parameters.PageSize);
        }

        public async Task<PersonDom> GetByIdAsync(int personId)
        {
            var person = await _personRepo.GetByIdAsync(personId);
            return person;
        }

        public async Task<PersonDom> CreatePersonAsync(PersonDom personResponse)
        {
            AddressValidator.ValidateCity(personResponse.Address.City);

            var createdPerson = await _personRepo.AddAsync(personResponse);
            return createdPerson;
        }

        public async Task UpdatePersonEmailAsync(int personId, PersonDom updatedPerson)
        {
            await _personRepo.UpdatePersonEmailAsync(personId, updatedPerson);
        }
        
        public async Task<PersonDom> UpdatePersonAsync(int id, PersonDom personRequest)
        {
            AddressValidator.ValidateCity(personRequest.Address.City);
            var (originalPerson, updatedPerson, shouldSendEmail) = await _personRepo.UpdateAsync(id, personRequest);

            if (shouldSendEmail)
            {
                _emailManager.SendPersonChangedEmail(originalPerson, updatedPerson);
            }

            _memoryCache.RemoveKeysWithPattern(@"^results_runtime_");
            _memoryCache.Remove(CacheKeyGenerator.GetAllResultsKey());

            return updatedPerson;
        }

        public async Task DeletePersonAsync(int personId)
        {
            await _personRepo.DeleteAsync(personId);
            _memoryCache.RemoveKeysWithPattern(@"^results_runtime_");
            _memoryCache.Remove(CacheKeyGenerator.GetAllResultsKey());
        }

        public async Task<PersonDom> GetByEmailAsync(string email)
        {
            var person = await _personRepo.GetByEmailAsync(email);
            return person;
        }
    }
}
using AutoMapper;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Infrastructure.Models;
using Jogging.Infrastructure.Models.DatabaseModels.Address;
using Jogging.Infrastructure.Models.DatabaseModels.Person;
using Jogging.Infrastructure.Models.DatabaseModels.School;
using Jogging.Infrastructure.Models.SearchModels.Person;
using Postgrest;
using Client = Supabase.Client;

namespace Jogging.Infrastructure.Repositories.SupabaseRepos
{
    public class PersonRepo : IPersonRepo
    {
        private readonly Client _client;
        private readonly IGenericRepo<AddressDom> _addressRepo;
        private readonly IGenericRepo<SchoolDom> _schoolRepo;
        private readonly IMapper _mapper;

        public PersonRepo(Client client, IGenericRepo<AddressDom> addressRepo, IGenericRepo<SchoolDom> schoolRepo, IMapper mapper)
        {
            _client = client;
            _addressRepo = addressRepo;
            _schoolRepo = schoolRepo;
            _mapper = mapper;
        }

        public async Task<List<PersonDom>> GetAllAsync()
        {
            var persons = await _client
                .From<ExtendedPerson>()
                .Get();

            if (persons.Models.Count <= 0)
            {
                throw new PersonException("No persons found");
            }

            return _mapper.Map<List<PersonDom>>(persons.Models);
        }

        public async Task<List<PersonDom>> GetBySearchValueAsync(string searchValue)
        {
            var parameters = new Dictionary<string, object>
            {
                { "search_value", searchValue }
            };

            var storedProcedure = await _client.Rpc<List<ExtendedPersonSearch>>("get_persons_by_search_value", parameters);

            if (storedProcedure == null || storedProcedure.Count == 0)
            {
                throw new PersonNotFoundException("Person not found");
            }

            return _mapper.Map<List<PersonDom>>(storedProcedure);
        }

        public async Task<PersonDom> GetByIdAsync(int personId)
        {
            var person = await GetPersonById(personId);

            if (person == null)
            {
                throw new PersonException("No person found");
            }

            return _mapper.Map<PersonDom>(person);
        }

        public async Task<PersonDom> GetByEmailAsync(string email)
        {
            var person = await _client.From<ExtendedPerson>()
                .Where(p => p.Email == email)
                .Limit(1)
                .Single();

            if (person == null)
            {
                throw new PersonException("No person found");
            }

            return _mapper.Map<PersonDom>(person);
        }

        Task<PersonDom> IGenericRepo<PersonDom>.UpdateAsync(int id, PersonDom updatedItem)
        {
            throw new NotImplementedException();
        }

        public async Task<PersonDom> AddAsync(PersonDom newPersonDom)
        {
            var address = await _addressRepo.UpsertAsync(null, newPersonDom.Address);

            newPersonDom.AddressId = address.Id;
            newPersonDom.Address = address;

            if (newPersonDom.School != null)
            {
                SchoolDom? school = await _schoolRepo.UpsertAsync(null, newPersonDom.School);
                newPersonDom.SchoolId = school.Id;
                newPersonDom.School = school;
            }

            var addedPerson = await _client
                .From<ExtendedPerson>()
                .Insert(_mapper.Map<ExtendedPerson>(newPersonDom));

            if (addedPerson.Model == null)
            {
                throw new PersonException("Something went wrong while adding your account");
            }

            newPersonDom.Id = addedPerson.Model.Id;

            return _mapper.Map<PersonDom>(newPersonDom);
        }

        public async Task<(PersonDom, PersonDom, bool shouldSendEmail)> UpdateAsync(int personId, PersonDom updatedPerson)
        {
            var currentPerson = await GetPersonById(personId);

            if (currentPerson == null)
            {
                throw new PersonException("Person not found");
            }

            var originalPerson = currentPerson.DeepCopy();

            var isAddressUpdated = await UpdateAddressIfNeeded(currentPerson, updatedPerson.Address);
            var isSchoolUpdated = await UpdateSchoolIfNeeded(currentPerson, updatedPerson.School);
            bool shouldSendEmail = currentPerson.Gender != updatedPerson.Gender || currentPerson.BirthDate != updatedPerson.BirthDate;

            if (isAddressUpdated || isSchoolUpdated || !_mapper.Map<PersonDom>(currentPerson).Equals(updatedPerson))
            {
                currentPerson.LastName = updatedPerson.LastName;
                currentPerson.FirstName = updatedPerson.FirstName;
                currentPerson.IBANNumber = updatedPerson.IBANNumber;
                currentPerson.BirthDate = updatedPerson.BirthDate;
                currentPerson.Gender = updatedPerson.Gender;

                var person = await currentPerson.Update<ExtendedPerson>();
                if (person.Model == null)
                {
                    throw new PersonException("Something went wrong while updating your account");
                }
            }

            return (_mapper.Map<PersonDom>(originalPerson), _mapper.Map<PersonDom>(currentPerson), shouldSendEmail);
        }

        public async Task UpdatePersonEmailAsync(int personId, PersonDom updatedPerson)
        {
            var currentPerson = await GetPersonById(personId);

            if (currentPerson == null)
            {
                throw new PersonException("Person not found");
            }

            currentPerson.Email = updatedPerson.Email;
            currentPerson.UserId = updatedPerson.UserId;

            var person = await currentPerson.Update<ExtendedPerson>();
            if (person.Model == null)
            {
                throw new PersonException("Something went wrong while updating your account");
            }
        }

        public Task<PersonDom> UpsertAsync(int? addressId, PersonDom updatedItem)
        {
            throw new NotImplementedException();
        }

        public async Task DeleteAsync(int personId)
        {
            var response = await _client
                .From<SimplePerson>()
                .Where(c => c.Id == personId)
                .Single();

            if (response == null)
            {
                throw new PersonNotFoundException("This person doesn't exist anymore");
            }

            await response.Delete<SimplePerson>();
        }

        public async Task<PersonDom?> GetByGuidAsync(string userId)
        {
            var person = await _client.From<ExtendedPerson>()
                .Where(p => p.UserId == userId)
                .Limit(1)
                .Single();

            if (person == null)
            {
                throw new PersonException("Something went wrong while getting your account information");
            }

            return _mapper.Map<PersonDom>(person);
        }

        private async Task<ExtendedPerson?> GetPersonById(int personId)
        {
            return await _client.From<ExtendedPerson>()
                .Where(p => p.Id == personId)
                .Limit(1)
                .Single();
        }

        private async Task<bool> UpdateAddressIfNeeded(ExtendedPerson person, AddressDom updatedAddress)
        {
            var currentAddress = _mapper.Map<AddressDom>(person.Address);

            if (!currentAddress.Equals(updatedAddress))
            {
                var address = await _addressRepo.UpsertAsync(null, updatedAddress);
                person.AddressId = address.Id;
                person.Address = _mapper.Map<SimpleAddress>(address);
                return true;
            }

            return false;
        }

        private async Task<bool> UpdateSchoolIfNeeded(ExtendedPerson person, SchoolDom? updatedPersonSchool)
        {
            var currentSchool = _mapper.Map<SchoolDom>(person.School);

            if (currentSchool != null && updatedPersonSchool == null)
            {
                person.SchoolId = null;
                person.School = null;
                return true;
            }

            if ((currentSchool == null && updatedPersonSchool != null) ||
                (updatedPersonSchool != null && currentSchool != null && !currentSchool.Equals(updatedPersonSchool)))
            {
                var school = await _schoolRepo.UpsertAsync(null, updatedPersonSchool);
                person.SchoolId = school.Id;
                person.School = _mapper.Map<SimpleSchool>(school);

                return true;
            }

            return false;
        }
    }
}
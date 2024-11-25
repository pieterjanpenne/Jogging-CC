using AutoMapper;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Infrastructure.Models;
using Jogging.Infrastructure.Models.DatabaseModels.School;

namespace Jogging.Infrastructure.Repositories.SupabaseRepos;

public class SchoolRepo : IGenericRepo<SchoolDom>
{
    private readonly Supabase.Client _client;
    private readonly IMapper _mapper;

    public SchoolRepo(Supabase.Client client, IMapper mapper)
    {
        _client = client;
        _mapper = mapper;
    }

    public async Task<List<SchoolDom>> GetAllAsync()
    {
        var schools = await _client
            .From<ExtendedSchool>()
            .Get();

        if (schools?.Models?.Count == null)
        {
            throw new SchoolNotFoundException("No schools found");
        }

        return _mapper.Map<List<SchoolDom>>(schools.Models);
    }

    public async Task<SchoolDom> GetByIdAsync(int schoolId)
    {
        var school = await GetSchoolById(schoolId);

        if (school == null)
        {
            throw new SchoolNotFoundException("No school found");
        }

        return _mapper.Map<SchoolDom>(school);
    }

    public async Task<SchoolDom> AddAsync(SchoolDom schoolDom)
    {
        var existingSchool = await GetSchoolByName(schoolDom.Name);

        if (existingSchool != null)
        {
            return _mapper.Map<SchoolDom>(existingSchool);
        }

        var response = await _client
            .From<SimpleSchool>()
            .Insert(_mapper.Map<SimpleSchool>(schoolDom));

        if (response.Model == null)
        {
            throw new SchoolNotFoundException("Something went wrong while adding your school");
        }

        return _mapper.Map<SchoolDom>(response.Model);
    }

    public async Task<SchoolDom> UpdateAsync(int schoolId, SchoolDom updatedSchool)
    {
        var existingSchool = await GetSchoolById(schoolId);

        if (existingSchool == null)
        {
            throw new SchoolNotFoundException("School not found");
        }

        if (_mapper.Map<SchoolDom>(existingSchool).Equals(updatedSchool))
        {
            return _mapper.Map<SchoolDom>(existingSchool);
        }

        existingSchool.Name = updatedSchool.Name;

        var update = await existingSchool
            .Update<SimpleSchool>();

        if (update.Model == null)
        {
            throw new SchoolException("Something went wrong while updating your school");
        }

        return _mapper.Map<SchoolDom>(existingSchool);
    }

    public async Task<SchoolDom> UpsertAsync(int? schoolId, SchoolDom updatedSchool)
    {
        SimpleSchool? currentSchool;
        if (schoolId.HasValue)
        {
            currentSchool = await GetSchoolById(schoolId.Value);
        }
        else
        {
            currentSchool = await GetSchoolByName(updatedSchool.Name);
        }

        if (currentSchool != null)
        {
            var currentSchoolDom = _mapper.Map<SchoolDom>(currentSchool);
            if (currentSchoolDom.Equals(updatedSchool))
            {
                return currentSchoolDom;
            }

            currentSchool.Name = updatedSchool.Name;

            var update = await currentSchool
                .Update<SimpleSchool>();

            if (update.Model == null)
            {
                throw new SchoolException("Something went wrong while updating your school");
            }

            return _mapper.Map<SchoolDom>(currentSchool);
        }

        return await AddAsync(updatedSchool);
    }

    public async Task DeleteAsync(int id)
    {
        await _client
            .From<SimpleSchool>()
            .Where(s => s.Id == id)
            .Delete();
    }

    private async Task<SimpleSchool?> GetSchoolById(int schoolId)
    {
        return await _client
            .From<SimpleSchool>()
            .Where(c => c.Id == schoolId)
            .Limit(1)
            .Single();
    }

    private async Task<SimpleSchool?> GetSchoolByName(string schoolName)
    {
        return await _client.From<SimpleSchool>()
            .Where(a => a.Name == schoolName)
            .Limit(1)
            .Single();
    }
}
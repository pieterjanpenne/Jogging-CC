using AutoMapper;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Infrastructure.Models.DatabaseModels.AgeCategory;
using Client = Supabase.Client;

namespace Jogging.Infrastructure.Repositories.SupabaseRepos;

public class AgeCategoryRepo : IAgeCategoryRepo
{
    private readonly Client _client;
    private readonly IMapper _mapper;

    public AgeCategoryRepo(Client client, IMapper mapper)
    {
        _client = client;
        _mapper = mapper;
    }

    public async Task<List<AgeCategoryDom>> GetAllAsync()
    {
        var ageCategories = await _client.From<SimpleAgeCategory>()
            .Get();

        if (ageCategories.Models.Count <= 0)
        {
            throw new AgeCategoryException("No age categories found");
        }

        return _mapper.Map<List<AgeCategoryDom>>(ageCategories.Models);
    }

    public async Task<AgeCategoryDom> GetByIdAsync(int ageCategoryId)
    {
        var ageCategory = await _client.From<SimpleAgeCategory>()
            .Where(ac => ac.Id == ageCategoryId)
            .Limit(1)
            .Single();

        if (ageCategory == null)
        {
            throw new AgeCategoryException("Age category not found");
        }

        return _mapper.Map<AgeCategoryDom>(ageCategory);
    }

    public async Task<AgeCategoryDom> GetAgeCategoryByAge(PersonDom person)
    {
        var ageCategory = await _client.From<SimpleAgeCategory>()
            .Where(ageCat => ageCat.MaximumAge >= person.BirthYearAge && ageCat.MinimumAge <= person.BirthYearAge)
            .Limit(1)
            .Single();

        if (ageCategory == null)
        {
            throw new AgeCategoryException("Age category not found");
        }

        return _mapper.Map<AgeCategoryDom>(ageCategory);
    }

    public Task<AgeCategoryDom> AddAsync(AgeCategoryDom person)
    {
        throw new NotImplementedException();
    }


    public Task<AgeCategoryDom> UpdateAsync(int id, AgeCategoryDom updatedItem)
    {
        throw new NotImplementedException();
    }

    public Task<AgeCategoryDom> UpsertAsync(int? id, AgeCategoryDom updatedItem)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }
}
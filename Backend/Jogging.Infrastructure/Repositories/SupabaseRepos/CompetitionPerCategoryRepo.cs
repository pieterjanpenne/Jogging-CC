using AutoMapper;
using Jogging.Domain.Enums;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Infrastructure.Models.DatabaseModels.CompetitionPerCategory;
using Postgrest;
using Client = Supabase.Client;

namespace Jogging.Infrastructure.Repositories.SupabaseRepos;

public class CompetitionPerCategoryRepo : ICompetitionPerCategoryRepo
{
    private readonly Client _client;
    private readonly IAgeCategoryRepo _ageCategoryRepo;
    private readonly IMapper _mapper;

    public CompetitionPerCategoryRepo(Client client, IAgeCategoryRepo ageCategoryRepo, IMapper mapper)
    {
        _client = client;
        _ageCategoryRepo = ageCategoryRepo;
        _mapper = mapper;
    }

    public async Task<List<CompetitionPerCategoryDom>> UpdateAsync(Dictionary<string, float> distances, int competitionId)
    {
        var tasks = distances
            .OrderBy(c => c.Value)
            .Select(async keyValuePair =>
            {
                var response = await _client
                    .From<SimpleCompetitionPerCategory>()
                    .Where(c => c.CompetitionId == competitionId && c.DistanceName == keyValuePair.Key)
                    .Set(cpc => cpc.DistanceInKm, keyValuePair.Value)
                    .Update();

                return response.Models;
            });

        var results = await Task.WhenAll(tasks);
        return results.SelectMany(m => _mapper.Map<List<CompetitionPerCategoryDom>>(m)).ToList();
    }

    public async Task DeleteAsync(int competitionPerCategoryId)
    {
        await _client.From<SimpleCompetitionPerCategory>()
            .Where(c => c.Id == competitionPerCategoryId)
            .Delete();
    }

    public async Task<List<CompetitionPerCategoryDom>> AddAsync(Dictionary<string, float> distances,
        int competitionId)
    {
        var ageCategories = await _ageCategoryRepo.GetAllAsync();
        List<SimpleCompetitionPerCategory> competitionPerCategories = new List<SimpleCompetitionPerCategory>();

        ageCategories.ToList().ForEach(a =>
        {
            foreach (var keyValuePair in distances.OrderBy(c => c.Value))
            {
                foreach (Char gender in (Genders[])Enum.GetValues(typeof(Genders)))
                {
                    var competitionPerCategory = new SimpleCompetitionPerCategory()
                    {
                        DistanceName = keyValuePair.Key,
                        DistanceInKm = keyValuePair.Value,
                        AgeCategoryId = a.Id,
                        CompetitionId = competitionId,
                        Gender = gender
                    };
                    competitionPerCategories.Add(competitionPerCategory);
                }
            }
        });
        var response = await _client.From<SimpleCompetitionPerCategory>()
            .Insert(competitionPerCategories);

        if (response.Models.Count <= 0)
        {
            throw new CompetitionPerCategoryException("Something went wrong while adding competition categories");
        }

        return _mapper.Map<List<CompetitionPerCategoryDom>>(response.Models);
    }

    public async Task UpdateGunTimeAsync(int competitionId, DateTime gunTime)
    {
        var updatedCompetitionPerCategories = await GetByCompetitionIdAsync(competitionId)
            .Set(cpc => cpc.GunTime!, gunTime)
            .Update();

        if (updatedCompetitionPerCategories.Models.Count <= 0)
        {
            throw new CompetitionException("Competition not found");
        }
    }

    public async Task<CompetitionPerCategoryDom> GetCompetitionPerCategoryByParameters(int ageCategoryId, string distanceName, char personGender,
        int competitionId)
    {
        var competitionPerCategories = await _client.From<SimpleCompetitionPerCategory>()
            .Where(cPc => cPc.AgeCategoryId == ageCategoryId)
            .Where(cPc => cPc.DistanceName == distanceName)
            .Where(cPc => cPc.CompetitionId == competitionId)
            .Get();

        var competitionPerCategory = competitionPerCategories.Models
            .FirstOrDefault(cPc => char.ToLower(cPc.Gender) == char.ToLower(personGender));

        if (competitionPerCategory == null)
        {
            throw new CompetitionException("This competition per category doesn't exist");
        }

        return _mapper.Map<CompetitionPerCategoryDom>(competitionPerCategory);
    }

    private Table<SimpleCompetitionPerCategory> GetByCompetitionIdAsync(int competitionId)
    {
        return _client.From<SimpleCompetitionPerCategory>()
            .Where(cpc => cpc.CompetitionId == competitionId);
    }

    public Task<CompetitionPerCategoryDom> AddAsync(CompetitionPerCategoryDom person)
    {
        throw new NotImplementedException();
    }

    public Task<List<CompetitionPerCategoryDom>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<CompetitionPerCategoryDom> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<CompetitionPerCategoryDom> UpdateAsync(int id, CompetitionPerCategoryDom updatedItem)
    {
        throw new NotImplementedException();
    }

    public Task<CompetitionPerCategoryDom> UpsertAsync(int? id, CompetitionPerCategoryDom updatedItem)
    {
        throw new NotImplementedException();
    }
}
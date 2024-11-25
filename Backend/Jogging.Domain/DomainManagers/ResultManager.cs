using AutoMapper;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Domain.Validators;
using Microsoft.Extensions.Caching.Memory;

namespace Jogging.Domain.DomainManagers;

public class ResultManager
{
    private readonly IResultRepo _resultRepo;
    private readonly CompetitionManager _competitionManager;
    private readonly ICompetitionPerCategoryRepo _competitionPerCategoryRepo;
    private readonly IMapper _mapper;
    private readonly CustomMemoryCache _memoryCache;
    private readonly CachingHelper _cachingHelper;


    public ResultManager(IMapper mapper, ICompetitionPerCategoryRepo competitionPerCategoryRepo, CustomMemoryCache memoryCache, IResultRepo resultRepo,
        CompetitionManager competitionManager, CachingHelper cachingHelper)
    {
        _mapper = mapper;
        _competitionPerCategoryRepo = competitionPerCategoryRepo;
        _memoryCache = memoryCache;
        _resultRepo = resultRepo;
        _competitionManager = competitionManager;
        _cachingHelper = cachingHelper;
    }

    public async Task<List<ResultFunctionDom>> GetAllResults()
    {
        string cacheKey = CacheKeyGenerator.GetAllResultsKey();

        return await _cachingHelper.GetOrSetAsync(cacheKey, async () =>
        {
            var allResults = await _resultRepo.GetAllResults();

            var resultFunctionDom = allResults.ToList();

            if (allResults == null || resultFunctionDom.Count == 0)
            {
                throw new ResultException("No results found");
            }

            return resultFunctionDom;
        });
    }

    public async Task<PagedList<ResultDom>> GetPersonResults(QueryStringParameters parameters, int personId)
    {
        var results = await _resultRepo.GetPersonResultByIdAsync(personId);

        if (!results.Any())
        {
            throw new ResultException("No results found");
        }

        return PagedList<ResultDom>.ToPagedList(results, parameters.PageNumber, parameters.PageSize);
    }

    public async Task<PagedList<ResultDom>> GetCompetitionResults(QueryStringParameters parameters, int competitionId, char? gender,
        string? ageCategory, string? distanceName)
    {
        string cacheKey = CacheKeyGenerator.GetCompetitionResultsKey(competitionId);

        var results = await _cachingHelper.GetOrSetAsync(cacheKey, async () =>
        {
            var resultQuery = await _resultRepo.GetCompetitionResultByIdWithRunNumberAsync(competitionId);

            if (!resultQuery.Any())
            {
                throw new ResultException("No valid results found");
            }

            return resultQuery;
        });

        if (gender.HasValue)
        {
            results = results.Where(r => char.ToLower(r.Person.Gender) == char.ToLower(gender.Value));
        }

        if (!string.IsNullOrEmpty(ageCategory))
        {
            results = results.Where(r => r.CompetitionPerCategory.AgeCategory.Name.Equals(ageCategory, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(distanceName))
        {
            results = results.Where(r => r.CompetitionPerCategory.DistanceName.Equals(distanceName, StringComparison.OrdinalIgnoreCase));
        }

        if (!results.Any())
        {
            throw new ResultException("No results found");
        }

        return PagedList<ResultDom>.ToPagedList(results, parameters.PageNumber, parameters.PageSize);
    }

    public async Task<IQueryable<ResultDom>> GetCompetitionResultByIdAsync(int competitionId)
    {
        var results = await _resultRepo.GetCompetitionResultByIdAsync(competitionId);

        if (!results.Any())
        {
            throw new ResultException("No valid results found");
        }

        return results;
    }

    public async Task UpdateRunTimeAsync(int registrationId, ResultDom result)
    {
        await _resultRepo.UpdateRunTimeAsync(registrationId, result);
    }

    public async Task BulkUpdateResultsAsync(int competitionId, ResultDom resultRequestDom)
    {
        ResultValidator.ValidateResultFile(resultRequestDom.FormFile);
        var results = await GetCompetitionResultByIdAsync(competitionId);
        var resultsDom = _mapper.Map<List<ResultDom>>(results);
        var updatedResults = await GetResultsFromFile.GetUpdatedRegistrations(resultRequestDom, resultsDom);
        ResultValidator.ValidateUpdatedRegistrations(updatedResults);

        await _resultRepo.UpsertBulkAsync(updatedResults.Values.ToList());

        _memoryCache.Remove(CacheKeyGenerator.GetCompetitionResultsKey(competitionId));
        _memoryCache.Remove(CacheKeyGenerator.GetAllResultsKey());
    }

    public async Task UpdateGunTime(int competitionId, DateTime gunTime)
    {
        await _competitionPerCategoryRepo.UpdateGunTimeAsync(competitionId, gunTime);

        _memoryCache.Remove(CacheKeyGenerator.GetCompetitionResultsKey(competitionId));
    }
}
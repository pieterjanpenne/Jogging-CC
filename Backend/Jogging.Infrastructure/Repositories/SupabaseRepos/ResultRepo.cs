using AutoMapper;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Infrastructure.Models.DatabaseModels.CompetitionResult;
using Jogging.Infrastructure.Models.DatabaseModels.Result;
using Jogging.Infrastructure.Models.SearchModels.Result;
using Microsoft.Extensions.Caching.Memory;
using Postgrest;
using Client = Supabase.Client;

namespace Jogging.Infrastructure.Repositories.SupabaseRepos;

public class ResultRepo : IResultRepo
{
    private readonly Client _client;
    private readonly CustomMemoryCache _memoryCache;
    private readonly IMapper _mapper;

    public ResultRepo(Client client, CustomMemoryCache memoryCache, IMapper mapper)
    {
        _client = client;
        _memoryCache = memoryCache;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ResultFunctionDom>> GetAllResults()
    {
        var allResults = await _client.Rpc<ExtendedResultFunctionResponse[]>("get_competition_results", new {});

        if (allResults == null || allResults.Length == 0)
        {
            throw new ResultException("No results found");
        }

        return _mapper.Map<IEnumerable<ResultFunctionDom>>(allResults);
    }

    public async Task<IQueryable<ResultDom>> GetPersonResultByIdAsync(int personId)
    {
        var results = await _client.From<ExtendedResult>()
            .Where(r => r.PersonId == personId)
            .Where(r => r.RunTime != null)
            .Where(r => r.RunNumber != null)
            .Get();

        if (results?.Models?.Count == null)
        {
            throw new ResultException("No results found");
        }

        return _mapper.Map<List<ResultDom>>(results.Models).AsQueryable();
    }

    public async Task<IQueryable<ResultDom>> GetCompetitionResultByIdAsync(int competitionId)
    {
        var results = await _client.From<SimpleResult>()
            .Where(competitionResult => competitionResult.CompetitionId == competitionId)
            .Where(competitionResult => competitionResult.RunNumber != null)
            .Get();

        if (results.Models.Count <= 0)
        {
            throw new ResultException("No results found");
        }

        var resultsQuery = _mapper.Map<List<ResultDom>>(results.Models).AsQueryable();
        return resultsQuery;
    }

    public async Task<IQueryable<ResultDom>> GetCompetitionResultByIdWithRunNumberAsync(int competitionId)
    {
        var results = await _client.From<ExtendedCompetitionResult>()
            .Where(competitionResult => competitionResult.CompetitionId == competitionId)
            .Where(competitionResult => competitionResult.RunNumber != null)
            .Where(competitionResult => competitionResult.RunTime != null)
            .Order(competitionResult => competitionResult.RunTime!, Constants.Ordering.Ascending)
            .Get();

        if (results.Models.Count <= 0)
        {
            throw new ResultException("No valid results found");
        }

        var resultsQuery = _mapper.Map<List<ResultDom>>(results.Models).AsQueryable();
        return resultsQuery;
    }

    public async Task UpsertBulkAsync(List<ResultDom> registrations)
    {
        await _client.From<SimpleResult>()
            .Upsert(_mapper.Map<List<SimpleResult>>(registrations));
    }

    public async Task UpdateRunTimeAsync(int registrationId, ResultDom updatedResult)
    {
        var registration = await _client.From<SimpleResult>()
            .Where(r => r.Id == registrationId)
            .Set(r => r.RunTime!, updatedResult.RunTime)
            .Update();

        if (registration.Model == null)
        {
            throw new ResultException("Result not found");
        }

        _memoryCache.Remove(CacheKeyGenerator.GetCompetitionResultsKey(registration.Model.CompetitionId));
        _memoryCache.Remove(CacheKeyGenerator.GetAllResultsKey());
    }
}
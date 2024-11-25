using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Domain.Validators;

namespace Jogging.Domain.DomainManagers;

public class CompetitionManager
{
    private readonly ICompetitionRepo _competitionRepo;

    public CompetitionManager(ICompetitionRepo competitionRepo)
    {
        _competitionRepo = competitionRepo;
    }

    public static Dictionary<string, float> GetDistances(CompetitionDom response)
    {
        var filteredCompetitionPerCategories = (response.CompetitionPerCategories ?? throw new CompetitionPerCategoryException("Competition per categories not found"))
            .GroupBy(c => c.DistanceName)
            .Select(g => g.First())
            .OrderBy(c => c.DistanceInKm)
            .ToDictionary(c => c.DistanceName, c => c.DistanceInKm);

        return filteredCompetitionPerCategories;
    }


    public async Task<PagedList<CompetitionDom>> GetAll(QueryStringParameters parameters, bool checkActive, string? competitionName, DateOnly? startDate, DateOnly? endDate)
    {
        List<CompetitionDom> competitions;

        if (checkActive)
        {
            competitions = await (string.IsNullOrEmpty(competitionName) && !startDate.HasValue && !endDate.HasValue ?
                _competitionRepo.GetAllActiveAsync() :
                _competitionRepo.GetAllActiveWithSearchValuesAsync(competitionName, startDate, endDate));
        }
        else
        {
            competitions = await (string.IsNullOrEmpty(competitionName) && !startDate.HasValue && !endDate.HasValue ?
                _competitionRepo.GetAllAsync() :
                _competitionRepo.GetAllWithSearchValuesAsync(competitionName, startDate, endDate));
        }

        if (competitions.Count == 0)
        {
            throw new CompetitionException("No competitions found");
        }

        return PagedList<CompetitionDom>.ToPagedList(competitions.AsQueryable(), parameters.PageNumber, parameters.PageSize);
    }
    
    public async Task<List<CompetitionDom>> GetAllActiveAsync()
    {
        var competitions = await _competitionRepo.GetAllActiveAsync();
        
        if (competitions.Count == 0)
        {
            throw new CompetitionException("No competitions found");
        }

        return competitions;
    }    
    public async Task<List<CompetitionDom>> GetAllActiveRankingCompetitionsAsync()
    {
        var competitions = await _competitionRepo.GetAllActiveRankingAsync();
        
        if (competitions.Count == 0)
        {
            throw new CompetitionException("No competitions found");
        }

        return competitions;
    }
    
    public async Task<CompetitionDom> GetById(int id)
    {
        var competition = await _competitionRepo.GetByIdAsync(id);
        
        if (competition == null)
        {
            throw new CompetitionException("No competitions found");
        }
        
        competition.Distances = GetDistances(competition);
        
        return competition;
    }

    public async Task<CompetitionDom> AddAsync(CompetitionDom competitionRequest)
    {
        DistanceValidator.ValidateDistances(competitionRequest.Distances);
        var response = await _competitionRepo.AddAsync(competitionRequest);
        response.Distances = GetDistances(response);

        return response;
    }

    public async Task<CompetitionDom> UpdateAsync(int id, CompetitionDom competitionRequest)
    {
        DistanceValidator.ValidateDistances(competitionRequest.Distances);
        var response = await _competitionRepo.UpdateAsync(id, competitionRequest);
        response.Distances = GetDistances(response);

        return response;
    }

    public async Task DeleteAsync(int competitionId)
    {
        await _competitionRepo.DeleteAsync(competitionId);
    }
}
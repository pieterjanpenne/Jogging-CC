using Jogging.Domain.Models;

namespace Jogging.Domain.Interfaces.RepositoryInterfaces;

public interface ICompetitionRepo : IGenericRepo<CompetitionDom>
{
    public Task<List<CompetitionDom>> GetAllWithSearchValuesAsync(string? competitionName, DateOnly? startDate, DateOnly? endDate);
    public Task<List<CompetitionDom>> GetAllActiveAsync();
    public Task<List<CompetitionDom>> GetAllActiveRankingAsync();
    public Task<CompetitionDom> GetSimpleCompetitionByIdAsync(int competitionId);
    public Task<List<CompetitionDom>> GetAllActiveWithSearchValuesAsync(string? competitionName, DateOnly? startDate, DateOnly? endDate);
}
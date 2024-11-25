using Jogging.Domain.Models;

namespace Jogging.Domain.Interfaces.RepositoryInterfaces;

public interface IResultRepo
{
    public Task<IEnumerable<ResultFunctionDom>> GetAllResults();
    public Task<IQueryable<ResultDom>> GetPersonResultByIdAsync(int id);
    public Task<IQueryable<ResultDom>> GetCompetitionResultByIdAsync(int competitionId);
    public Task<IQueryable<ResultDom>> GetCompetitionResultByIdWithRunNumberAsync(int competitionId);
    
    public Task UpsertBulkAsync(List<ResultDom> registrations);
    public Task UpdateRunTimeAsync(int id, ResultDom result);
}
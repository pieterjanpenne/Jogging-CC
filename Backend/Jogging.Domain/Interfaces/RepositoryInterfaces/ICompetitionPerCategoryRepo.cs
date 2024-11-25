using Jogging.Domain.Models;

namespace Jogging.Domain.Interfaces.RepositoryInterfaces;

public interface ICompetitionPerCategoryRepo : IGenericRepo<CompetitionPerCategoryDom>
{
    public Task<List<CompetitionPerCategoryDom>> UpdateAsync(Dictionary<string, float> distances, int competitionId);
    public Task<List<CompetitionPerCategoryDom>> AddAsync(Dictionary<string, float> distances, int competitionId);
    public Task UpdateGunTimeAsync(int competitionId, DateTime gunTime);
    public Task<CompetitionPerCategoryDom> GetCompetitionPerCategoryByParameters(int ageCategoryId, string distanceName, char personGender, int competitionId);
}
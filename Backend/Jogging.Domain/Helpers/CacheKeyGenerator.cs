namespace Jogging.Domain.Helpers;

public static class CacheKeyGenerator
{
    public static string GetAllResultsKey() => "all_results";
    public static string GetCompetitionResultsKey(int competitionId) =>
        $"results_runtime_{competitionId}";
}
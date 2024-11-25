using Newtonsoft.Json;

namespace Jogging.Infrastructure.Models.SearchModels.Result;

public class ExtendedResultFunctionResponse
{
    [JsonProperty("competition_id")]
    public string CompetitionId { get; set; }

    [JsonProperty("run_time")]
    public TimeSpan RunTime { get; set; }

    [JsonProperty("person_id")]
    public int PersonId { get; set; }

    [JsonProperty("first_name")]
    public string FirstName { get; set; }

    [JsonProperty("last_name")]
    public string LastName { get; set; }

    [JsonProperty("gender")]
    public char Gender { get; set; }

    [JsonProperty("distance_name")]
    public string DistanceName { get; set; }

    [JsonProperty("age_category_name")]
    public string AgeCategoryName { get; set; }
}
using System.Text.Json.Serialization;

namespace Jogging.Domain.Models;

public class RankingDom
{
    public SimplePersonDom Person { get; set; }

    [JsonIgnore]
    public List<int> PointList { get; set; } = [];

    public int Points { get; set; } = 0;

    public int AmountOfRaces { get; set; } = 1;
}
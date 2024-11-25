using System.ComponentModel.DataAnnotations;
using Postgrest.Attributes;

namespace Jogging.Domain.Models;

public class CompetitionDom
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime Date { get; set; }
    public bool Active { get; set; }
    public bool RankingActive { get; set; }
    public string? Information { get; set; }
    public int AddressId { get; set; }
    public AddressDom Address { get; set; }
    public List<CompetitionPerCategoryDom>? CompetitionPerCategories { get; set; }
    public Dictionary<string, float>? Distances { get; set; }
    
    public override int GetHashCode()
    {
        unchecked
        {
            int hash = 17;
            hash = hash * 23 + (Name ?? "").GetHashCode();
            hash = hash * 23 + (Date).GetHashCode();
            hash = hash * 23 + (Active).GetHashCode();
            hash = hash * 23 + (RankingActive).GetHashCode();
            hash = hash * 23 + (Information ?? "").GetHashCode();
            return hash;
        }
    }

    public override bool Equals(object? obj)
    {
        if (!(obj is CompetitionDom other))
            return false;

        return Name == other.Name && Date == other.Date && Active == other.Active && RankingActive == other.RankingActive && Information == other.Information;
    }
}
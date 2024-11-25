using Jogging.Rest.DTOs.AddressDtos;

namespace Jogging.Rest.DTOs.CompetitionDtos;

public class CompetitionRequestDTO
{
    public string Name { get; set; }
    public DateTime? Date { get; set; }
    public bool Active { get; set; }
    public bool RankingActive { get; set; }
    public string? Information { get; set; }
    public AddressRequestDTO? Address { get; set; }
    public Dictionary<string, float>? Distances { get; set; }
}
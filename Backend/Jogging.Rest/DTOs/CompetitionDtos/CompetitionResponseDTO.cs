using Jogging.Rest.DTOs.AddressDtos;
using Jogging.Rest.DTOs.CompetitionPerCategoryDtos;

namespace Jogging.Rest.DTOs.CompetitionDtos;

public class CompetitionResponseDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime? Date { get; set; }
    public bool Active { get; set; }
    public bool RankingActive { get; set; }
    public string? Information { get; set; }
    public int? AddressId { get; set; }
    public AddressResponseDTO? Address { get; set; }
    public List<CompetitionPerCategoryResponseDTO>? CompetitionPerCategories { get; set; }
    public Dictionary<string, float>? Distances { get; set; }
}
namespace Jogging.Rest.DTOs.AgeCategoryDtos;

public class AgeCategoryResponseDTO
{
    public int Id { get; set; }
    public string Name { get; set; }

    public int MinimumAge { get; set; }
    public int MaximumAge { get; set; }
}
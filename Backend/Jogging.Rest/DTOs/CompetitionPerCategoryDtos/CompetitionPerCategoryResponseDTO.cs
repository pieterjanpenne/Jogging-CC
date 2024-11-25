using Jogging.Rest.DTOs.AgeCategoryDtos;

namespace Jogging.Rest.DTOs.CompetitionPerCategoryDtos;

public class CompetitionPerCategoryResponseDTO
{
    public int Id { get; set; }
    public string DistanceName { get; set; }

    public float DistanceInKm { get; set; }

    public char Gender { get; set; }

    //public int AgeCategoryId { get; set; }
    public AgeCategoryResponseDTO AgeCategory { get; set; }

    public int CompetitionId { get; set; }
    //public CompetitionRequestDTO CompetitionRequest { get; set; }

    public DateTime? GunTime { get; set; }

    //public List<RegistrationResponseDTO> Registrations { get; set; }
}
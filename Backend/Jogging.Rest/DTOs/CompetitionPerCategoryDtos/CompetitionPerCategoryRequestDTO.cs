using Jogging.Rest.DTOs.AgeCategoryDtos;
using Jogging.Rest.DTOs.CompetitionDtos;
using Jogging.Rest.DTOs.RegistrationDtos;

namespace Jogging.Rest.DTOs.CompetitionPerCategoryDtos;

public class CompetitionPerCategoryRequestDTO
{
    public string DistanceName { get; set; }

    public float DistanceInKm { get; set; }

    public char Gender { get; set; }

    public AgeCategoryResponseDTO AgeCategory { get; set; }

    public CompetitionRequestDTO Competition { get; set; }

    public DateTime? GunTime { get; set; }

    public List<RegistrationRequestDTO> Registrations { get; set; }
}
using Jogging.Rest.DTOs.CompetitionPerCategoryDtos;

namespace Jogging.Rest.DTOs.RegistrationDtos;

public class ResultRegistrationResponseDTO
{
    public int Id { get; set; }

    public short? RunNumber { get; set; }

    public TimeSpan? RunTime { get; set; }

    public int CompetitionPerCategoryId { get; set; }
    public CompetitionPerCategoryResponseDTO CompetitionPerCategory { get; set; }
}
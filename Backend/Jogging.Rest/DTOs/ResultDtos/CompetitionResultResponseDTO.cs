using Jogging.Rest.DTOs.CompetitionPerCategoryDtos;
using Jogging.Rest.DTOs.PersonDtos;

namespace Jogging.Rest.DTOs.ResultDtos;

public class CompetitionResultResponseDTO
{
    public int Id { get; set; }

    public short? RunNumber { get; set; }

    public TimeSpan? RunTime { get; set; }

    public int CompetitionPerCategoryId { get; set; }
    
    public bool? Paid { get; set; }
    
    public int CompetitionId { get; set; }
    
    public int PersonId { get; set; }

    public CompetitionPerCategoryResponseDTO CompetitionPerCategory { get; set; }

    public PersonResponseDTO Person { get; set; }
}
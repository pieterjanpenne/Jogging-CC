using Microsoft.AspNetCore.Http;

namespace Jogging.Domain.Models;

public class ResultDom
{
    public int Id { get; set; }

    public short? RunNumber { get; set; }

    public TimeSpan? RunTime { get; set; }

    public int CompetitionPerCategoryId { get; set; }
    
    public bool? Paid { get; set; }
    
    public int CompetitionId { get; set; }
    
    public int PersonId { get; set; }

    public CompetitionPerCategoryDom CompetitionPerCategory { get; set; }

    public PersonDom Person { get; set; }
    public IFormFile? FormFile { get; set; }
}
using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.Result;

[Table("Registration")]
public class SimpleResult : BaseModel
{
    [PrimaryKey]
    public int Id { get; set; }

    [Column("RunNumber")]
    public short? RunNumber { get; set; }

    [Column("RunTime")]
    public TimeSpan? RunTime { get; set; }

    [Column("CompetitionPerCategoryId")]
    public int CompetitionPerCategoryId { get; set; }
    
    [Column("Paid")]
    public bool? Paid { get; set; }
    
    [Column("CompetitionId")]
    public int CompetitionId { get; set; }
    
    [Column("PersonId")]
    public int PersonId { get; set; }
}
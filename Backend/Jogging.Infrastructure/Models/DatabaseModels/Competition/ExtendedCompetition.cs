using System.ComponentModel.DataAnnotations;
using Jogging.Infrastructure.Models.DatabaseModels.Address;
using Jogging.Infrastructure.Models.DatabaseModels.CompetitionPerCategory;
using Newtonsoft.Json;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.Competition;

[Table("Competition")]
public class ExtendedCompetition : BaseModel
{
    [PrimaryKey]
    public int Id { get; set; }

    [Required] 
    [Column("Name")] 
    public string Name { get; set; }
    [Column("Date")] 
    public DateTime? Date { get; set; }

    [Column("Active")] 
    public bool Active { get; set; } = false;

    [Column("RankingActive")] 
    public bool RankingActive { get; set; } = false;

    [Column("Information")] 
    public string? Information { get; set; }

    [Column("AddressId")] 
    public int? AddressId { get; set; }
    
    [JsonIgnore]
    public Dictionary<string, float>? Distances { get; set; }
    
    [Reference(typeof(SimpleAddress), ReferenceAttribute.JoinType.Left)]
    public SimpleAddress Address { get; set; }
    
    [Reference(typeof(ExtendedCompetitionPerCategory), ReferenceAttribute.JoinType.Left)]
    public List<ExtendedCompetitionPerCategory>? CompetitionPerCategories { get; set; }
}
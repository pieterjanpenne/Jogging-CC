using System.ComponentModel.DataAnnotations;
using Jogging.Infrastructure.Models.DatabaseModels.Address;
using Newtonsoft.Json;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.Competition;

[Table("Competition")]
public class SimpleCompetition : BaseModel
{
    [PrimaryKey]
    public int Id { get; set; }

    [Required] 
    [Column("Name")] 
    public string Name { get; set; }
    [Column("Date")] 
    public DateTime Date { get; set; }

    [Column("Active")] 
    public bool Active { get; set; } = false;
    
    [Column("RankingActive")] 
    public bool RankingActive { get; set; }
    
    [Column("Information")] 
    public string? Information { get; set; }

    [Column("AddressId")] 
    public int? AddressId { get; set; }

    [JsonIgnore]
    public Dictionary<string, float>? Distances { get; set; }
    
        
    [Reference(typeof(SimpleAddress), ReferenceAttribute.JoinType.Inner)]
    public SimpleAddress Address { get; set; }
}
using System.ComponentModel.DataAnnotations;
using Jogging.Infrastructure.Models.DatabaseModels.Competition;
using Newtonsoft.Json;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.Address;
[Table("Address")]
public class ExtendedAddress : BaseModel
{
    [PrimaryKey]
    public int Id { get; set; }
    
    [Column("HouseNumber")]
    public string? HouseNumber { get; set; }
    
    [Column("Street")]
    public string? Street { get; set; }
    
    [Column("ZipCode")]
    public string? ZipCode { get; set; }
    
    [Required]
    [Column("City")]
    public string City { get; set; }

    [Reference(typeof(Person.ExtendedPerson), ReferenceAttribute.JoinType.Left)]
    [JsonIgnore]
    public List<Person.ExtendedPerson> People { get; set; }
    [Reference(typeof(ExtendedCompetition), ReferenceAttribute.JoinType.Left)]
    [JsonIgnore]
    public List<ExtendedCompetition> Competitions { get; set; }
}
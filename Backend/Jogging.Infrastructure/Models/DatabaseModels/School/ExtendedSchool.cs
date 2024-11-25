using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.School;

[Table("School")]
public class ExtendedSchool: BaseModel
{
    [PrimaryKey]
    public int Id { get; set; }

    [Required]
    [Column("Name")]
    public string Name { get; set; }

    [Reference(typeof(Person.ExtendedPerson), ReferenceAttribute.JoinType.Left)]
    [JsonIgnore]
    public List<Person.ExtendedPerson>? People { get; set; }
    
    public override int GetHashCode()
    {
        unchecked
        {
            int hash = 17;
            hash = hash * 23 + (Name ?? "").GetHashCode();
            return hash;
        }
    }

    public override bool Equals(object? obj)
    {
        if (!(obj is ExtendedSchool other))
            return false;

        return Name == other.Name;
    }
}
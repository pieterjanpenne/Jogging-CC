using System.ComponentModel.DataAnnotations;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.School;

[Table("School")]
public class SimpleSchool : BaseModel
{
    [PrimaryKey]
    public int Id { get; set; }

    [Required]
    [Column("Name")]
    public string Name { get; set; }
    
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
        if (!(obj is SimpleSchool other))
            return false;

        return Name == other.Name;
    }
}
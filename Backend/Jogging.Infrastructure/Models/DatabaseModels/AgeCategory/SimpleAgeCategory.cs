using System.ComponentModel.DataAnnotations;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.AgeCategory;

[Table("AgeCategory")]
public class SimpleAgeCategory: BaseModel
{
    [PrimaryKey]
    public int Id { get; set; }

    [Required]
    [Column("Name")]
    public string Name { get; set; }

    [Column("MinimumAge")]
    public int MinimumAge { get; set; }
    
    [Column("MaximumAge")]
    public int MaximumAge { get; set; }
}
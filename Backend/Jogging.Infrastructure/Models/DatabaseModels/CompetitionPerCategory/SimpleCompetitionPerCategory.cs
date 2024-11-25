using System.ComponentModel.DataAnnotations;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.CompetitionPerCategory;

[Table("CompetitionPerCategory")]
public class SimpleCompetitionPerCategory: BaseModel
{
    [PrimaryKey]
    public int Id { get; set; }

    [Required]
    [Column("DistanceName")] 
    public string DistanceName { get; set; }

    [Column("DistanceInKm")] 
    public float DistanceInKm { get; set; }
    [Column("Gender")] 
    public char Gender { get; set; }

    [Column("AgeCategoryId")] 
    public int AgeCategoryId { get; set; }

    [Column("CompetitionId")] 
    public int CompetitionId { get; set; }

    [Column("GunTime")] 
    public DateTime? GunTime { get; set; }
}
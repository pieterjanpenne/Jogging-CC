using System.ComponentModel.DataAnnotations;
using Jogging.Infrastructure.Models.DatabaseModels.AgeCategory;
using Jogging.Infrastructure.Models.DatabaseModels.Competition;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.CompetitionPerCategory;

[Table("CompetitionPerCategory")]
public class ExtendedCompetitionPerCategory: BaseModel
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

        
    [Reference(typeof(SimpleAgeCategory), ReferenceAttribute.JoinType.Left, foreignKey:"AgeCategoryId")]
    public SimpleAgeCategory AgeCategory { get; set; }
    
    [Reference(typeof(Registration.ExtendedRegistration), ReferenceAttribute.JoinType.Left)]
    public List<Registration.ExtendedRegistration> Registrations { get; set; }
    
    [Reference(typeof(ExtendedCompetition), ReferenceAttribute.JoinType.Left, foreignKey:"CompetitionId")]
    public ExtendedCompetition Competition { get; set; }

}
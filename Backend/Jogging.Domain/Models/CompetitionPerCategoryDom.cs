using System.ComponentModel.DataAnnotations;

namespace Jogging.Domain.Models;

public class CompetitionPerCategoryDom
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(30)]
    public string DistanceName { get; set; }

    public float DistanceInKm { get; set; }

    public char Gender { get; set; }

    public int AgeCategoryId { get; set; }
    public AgeCategoryDom AgeCategory { get; set; }

    public int CompetitionId { get; set; }
    public CompetitionDom Competition { get; set; }

    public DateTime? GunTime { get; set; }

    public List<RegistrationDom> Registrations { get; set; }
}
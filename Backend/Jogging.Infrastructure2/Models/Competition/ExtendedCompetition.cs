using Jogging.Infrastructure2.Models;
using Jogging.Infrastructure2.Models.CompetitionPerCategory;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Jogging.Infrastructure.Models.DatabaseModels.Competition;

[Table("Competition")]
public class ExtendedCompetition
{
    // Primary Key
    [Key]
    public int Id { get; set; }

    // Name of the competition (required)
    [Required]
    [Column("Name")]
    public string Name { get; set; }

    // Date of the competition (nullable)
    [Column("Date")]
    public DateTime? Date { get; set; }

    // Active status (default false)
    [Column("Active")]
    public bool Active { get; set; } = false;

    // Ranking active status (default false)
    [Column("RankingActive")]
    public bool RankingActive { get; set; } = false;

    // Information about the competition (nullable)
    [Column("Information")]
    public string? Information { get; set; }

    // Foreign key to Address (nullable)
    [Column("AddressId")]
    public int? AddressId { get; set; }

    // Navigation property for Address (foreign key relationship)
    [ForeignKey("AddressId")]
    public virtual AddressEF? Address { get; set; }

    // Distances dictionary (non-persistent, just for application logic)
    [JsonIgnore]
    public Dictionary<string, float>? Distances { get; set; }

    // Navigation property for CompetitionPerCategories (1-to-many relationship)
    public virtual List<ExtendedCompetitionPerCategory>? CompetitionPerCategories { get; set; }
}
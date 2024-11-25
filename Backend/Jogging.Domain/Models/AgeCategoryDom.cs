using System.ComponentModel.DataAnnotations;

namespace Jogging.Domain.Models;

public class AgeCategoryDom
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    public int MinimumAge { get; set; }
    public int MaximumAge { get; set; }
}
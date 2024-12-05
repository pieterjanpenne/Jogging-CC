using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jogging.Infrastructure2.Models;

[Table("Club")]
public partial class Club {
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    public string Name { get; set; } = null!;

    [StringLength(255)]
    public string? Logo { get; set; }

    public ICollection<Person>? Members { get; set; }
}

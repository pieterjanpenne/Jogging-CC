using System.ComponentModel.DataAnnotations;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.Person;
[Table("Person")]
public class SimplePerson: BaseModel
{
    [PrimaryKey]
    public int Id { get; set; }

    [Required]
    [Column("LastName")]
    public string LastName { get; set; }

    [Required]
    [Column("FirstName")]
    public string FirstName { get; set; }

    [Required]
    [Column("BirthDate")]
    public DateOnly BirthDate { get; set; }

    [Column("IBANNumber")]
    public string IBANNumber { get; set; }

    [Column("SchoolId")]
    public int? SchoolId { get; set; }

    [Column("AddressId")]
    public int? AddressId { get; set; }

    [Column("UserId")]
    public string? UserId { get; set; }
        
    [Required]
    [Column("Gender")]
    public Char Gender { get; set; }
    
    [Column("Email")]
    public string? Email { get; set; }
}
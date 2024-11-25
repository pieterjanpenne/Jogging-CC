using System.ComponentModel.DataAnnotations;
using Jogging.Infrastructure.Models.DatabaseModels.Address;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.Person;

[Table("Person")]
public class AdvancedPerson :  BaseModel
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
    
    [Column("Email")]
    public string? Email { get; set; }
        
    [Required]
    [Column("Gender")]
    public Char Gender { get; set; }

    [Reference(typeof(SimpleAddress), ReferenceAttribute.JoinType.Inner)]
    public SimpleAddress Address { get; set; }
}
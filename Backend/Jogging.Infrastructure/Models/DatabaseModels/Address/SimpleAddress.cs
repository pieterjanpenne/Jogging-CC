using System.ComponentModel.DataAnnotations;
using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.Address;
[Table("Address")]
public class SimpleAddress : BaseModel
{
    [PrimaryKey]
    public int Id { get; set; }
    
    [Column("HouseNumber")]
    public string? HouseNumber { get; set; }
    
    [Column("Street")]
    public string? Street { get; set; }
    
    [Column("ZipCode")]
    public string? ZipCode { get; set; }
    
    [Required]
    [Column("City")]
    public string City { get; set; }
    
    public override int GetHashCode()
    {
        unchecked
        {
            int hash = 17;
            hash = hash * 23 + (Street ?? "").GetHashCode();
            hash = hash * 23 + (HouseNumber ?? "").GetHashCode();
            hash = hash * 23 + (ZipCode ?? "").GetHashCode();
            hash = hash * 23 + (City ?? "").GetHashCode();
            return hash;
        }
    }

    public override bool Equals(object? obj)
    {
        if (!(obj is SimpleAddress other))
            return false;

        return Street == other.Street && HouseNumber == other.HouseNumber && ZipCode == other.ZipCode && City == other.City;
    }
}
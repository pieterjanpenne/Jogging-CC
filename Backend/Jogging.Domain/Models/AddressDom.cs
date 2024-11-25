using System.ComponentModel.DataAnnotations;

namespace Jogging.Domain.Models;

public class AddressDom
{
    public int Id { get; set; }
    public string? HouseNumber { get; set; }
    public string? Street { get; set; }
    public string? ZipCode { get; set; }
    public string City { get; set; }

    public List<PersonDom> People { get; set; }
    public List<CompetitionDom> Competitions { get; set; }
    
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
        if (!(obj is AddressDom other))
            return false;

        return Street == other.Street && HouseNumber == other.HouseNumber && ZipCode == other.ZipCode && City == other.City;
    }
}
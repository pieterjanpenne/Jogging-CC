using System.ComponentModel.DataAnnotations;

namespace Jogging.Domain.Models;

public class SchoolDom
{
    public int Id { get; set; }
    
    public string Name { get; set; }

    public List<PersonDom> People { get; set; }
    
    
    public override int GetHashCode()
    {
        unchecked
        {
            int hash = 17;
            hash = hash * 23 + (Name ?? "").GetHashCode();
            return hash;
        }
    }

    public override bool Equals(object? obj)
    {
        if (!(obj is SchoolDom other))
            return false;

        return Name == other.Name;
    }
}
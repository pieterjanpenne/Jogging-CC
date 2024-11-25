using Jogging.Domain.Enums;

namespace Jogging.Domain.Models;

public class RankingCategoryDom
{
    public char Gender { get; set; }
    public string DistanceName { get; set; }
    public string AgeCategoryName { get; set; }
    
    public override bool Equals(object obj)
    {
        if (obj is RankingCategoryDom other)
        {
            return AgeCategoryName == other.AgeCategoryName &&
                   DistanceName == other.DistanceName &&
                   Gender == other.Gender;
        }
        return false;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(AgeCategoryName, DistanceName, Gender);
    }

    public string GetKey()
    {
        var genderName = GetGenderName(Gender);
        return $"{genderName}${DistanceName}${AgeCategoryName}";
    }

    private string GetGenderName(char gender)
    {
        return char.ToUpper(gender) switch
        {
            'M' => Genders.Mannen.ToString(),
            'V' => Genders.Vrouwen.ToString(),
            _ => throw new ArgumentException($"Invalid gender value: {gender}")
        };
    }
}
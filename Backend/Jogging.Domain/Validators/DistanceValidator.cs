using Jogging.Domain.Exceptions;

namespace Jogging.Domain.Validators;

public static class DistanceValidator
{
    public static void ValidateDistances(Dictionary<string, float>? distances)
    {
        if (distances == null || !distances.ContainsKey("kort") || !distances.ContainsKey("midden") || !distances.ContainsKey("lang"))
        {
            throw new DistanceException("The distances must contain 'kort', 'midden', and 'lang'");
        }
    }
}
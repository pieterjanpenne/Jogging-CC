namespace Jogging.Domain.Helpers;

public class DictionaryHelper
{
    public static bool AreDictionariesEqual(Dictionary<string, float>? dict1, Dictionary<string, float>? dict2)
    {
        if (dict1 == null || dict2 == null)
            return false;

        if (dict1.Count != dict2.Count)
            return false;

        foreach (var pair in dict1)
        {
            if (!dict2.TryGetValue(pair.Key, out float value) || pair.Value != value)
                return false;
        }

        return true;
    }
}
using Jogging.Domain.Exceptions;

namespace Jogging.Domain.Validators;

public class AddressValidator
{
    public static void ValidateCity(string cityName)
    {
        if (string.IsNullOrWhiteSpace(cityName))
        {
            throw new AddressException("The city value is required");
        }
    }
}
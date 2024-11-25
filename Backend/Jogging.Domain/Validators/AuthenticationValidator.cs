using System.Text.RegularExpressions;
using Jogging.Domain.Exceptions;

namespace Jogging.Domain.Validators;

public class AuthenticationValidator
{
    public static void ValidateEmailInput(string email)
    {
        string pattern = @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$";

        if (!Regex.IsMatch(email, pattern))
        {
            throw new EmailException("Invalid email address format.");
        }
    }

    public static void ValidateJwtToken(string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            throw new TokenException("Authorization token not provided.");
        }
    }

    public static Guid ValidateGuId(string? guId)
    {
        try
        {
            if (guId == null)
            {
                throw new UserException("The user id was not valid");
            }

            return Guid.Parse(guId);
        }
        catch (Exception exception)
        {
            throw new UserException("The user id was not valid");
        }
    }

    public static int ValidateUserId(string? token)
    {
        try
        {
            if (token == null)
            {
                throw new UserException("The user id was not valid");
            }

            return int.Parse(token);
        }
        catch (Exception exception)
        {
            throw new UserException("The user id was not found");
        }
    }
}
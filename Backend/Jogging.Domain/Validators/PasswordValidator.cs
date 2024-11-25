using Jogging.Domain.Exceptions;
using System.Text.RegularExpressions;

namespace Jogging.Domain.Validators;

public class PasswordValidator
{
    public static string ValidatePassword(string password)
    {
        if (string.IsNullOrEmpty(password))
        {
            throw new PasswordException("Password cannot be empty");
        }

        if (password.Length < 6)
        {
            throw new PasswordException("Password must be at least 6 characters long");
        }

        if (!Regex.IsMatch(password, "[A-Z]"))
        {
            throw new PasswordException("Password must contain at least one uppercase letter");
        }

        if (!Regex.IsMatch(password, "[a-z]"))
        {
            throw new PasswordException("Password must contain at least one lowercase letter");
        }

        if (!Regex.IsMatch(password, "[0-9]"))
        {
            throw new PasswordException("Password must contain at least one number");
        }

        string[] commonPasswords = { "password", "123456", "abcdef" };
        if (commonPasswords.Contains(password))
        {
            throw new PasswordException("Password is too common");
        }

        return password;
    }
}
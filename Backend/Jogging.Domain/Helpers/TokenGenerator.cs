using System.Security.Cryptography;
using System.Text;

namespace Jogging.Domain.Helpers;

public class TokenGenerator
{
    public static string GenerateEmailToken(string email)
    {
        // Combine email with a new GUID
        string input = email + Guid.NewGuid().ToString();

        using (SHA256 sha256Hash = SHA256.Create())
        {
            // ComputeHash - returns byte array
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Convert byte array to a string
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }
    }
}
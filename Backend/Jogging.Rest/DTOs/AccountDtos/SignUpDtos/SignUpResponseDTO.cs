using Jogging.Rest.DTOs.PersonDtos;

namespace Jogging.Rest.DTOs.AccountDtos.SignUpDtos;

public class SignUpResponseDTO
{
    public Guid UserId { get; set; }
    private string _email;

    public string Email
    {
        get => _email;
        set => _email = value?.ToLower()?.Trim() ?? string.Empty;
    }
    private string _password;

    public string Password
    {
        get => _password;
        set => _password = value?.Trim();
    }

    public PersonResponseDTO PersonResponse { get; set; }
}
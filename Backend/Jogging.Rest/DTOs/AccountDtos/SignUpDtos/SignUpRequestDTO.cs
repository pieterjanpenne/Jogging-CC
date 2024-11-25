using Jogging.Rest.DTOs.PersonDtos;

namespace Jogging.Rest.DTOs.AccountDtos.SignUpDtos;

public class SignUpRequestDTO
{
    private string _email;

    public string Email
    {
        get => _email;
        set => _email = value?.ToLower();
    }
    private string _password;

    public string Password
    {
        get => _password;
        set => _password = value?.Trim();
    }

    public PersonRequestDTO Person { get; set; }
}
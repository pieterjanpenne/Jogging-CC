namespace Jogging.Rest.DTOs.AccountDtos.PasswordDtos;

public class EmailRequestDTO
{
    private string _email;

    public string Email
    {
        get => _email;
        set => _email = value.ToLower().Trim();
    }
}
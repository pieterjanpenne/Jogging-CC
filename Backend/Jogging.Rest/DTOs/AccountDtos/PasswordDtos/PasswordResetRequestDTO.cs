namespace Jogging.Rest.DTOs.AccountDtos.PasswordDtos;

public class PasswordResetRequestDTO
{
    public string recovery_token { get; set; }
    public string newPassword { get; set; }
    
}
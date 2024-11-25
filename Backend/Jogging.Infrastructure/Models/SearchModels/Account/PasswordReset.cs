namespace Jogging.Infrastructure.Models.SearchModels.Account;

public class PasswordReset
{
    public string recovery_token { get; set; }
    public string newPassword { get; set; }
}
namespace Jogging.Infrastructure.Models.SearchModels.Account;

public class PasswordChange
{
    public Guid UserId { get; set; }
    public string oldPassword { get; set; }
    public string newPassword { get; set; }
}
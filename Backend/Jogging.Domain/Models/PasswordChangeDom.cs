namespace Jogging.Domain.Models;

public class PasswordChangeDom
{
    public Guid UserId { get; set; }
    public string oldPassword { get; set; }
    public string newPassword { get; set; }
}
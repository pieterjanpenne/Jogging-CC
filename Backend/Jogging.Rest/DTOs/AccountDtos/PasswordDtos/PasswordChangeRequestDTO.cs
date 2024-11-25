using System.Text.Json.Serialization;

namespace Jogging.Rest.DTOs.AccountDtos.PasswordDtos;

public class PasswordChangeRequestDTO
{
    [JsonIgnore]
    public Guid UserId { get; set; }
    public string oldPassword { get; set; }
    public string newPassword { get; set; }
}
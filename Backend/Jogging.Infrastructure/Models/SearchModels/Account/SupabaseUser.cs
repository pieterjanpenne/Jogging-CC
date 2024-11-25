namespace Jogging.Infrastructure.Models.SearchModels.Account;

public class SupabaseUser
{
    public Guid? id { get; set; }
    public DateTime? email_confirmed_at { get; set; }
    public string? email { get; set; }
}
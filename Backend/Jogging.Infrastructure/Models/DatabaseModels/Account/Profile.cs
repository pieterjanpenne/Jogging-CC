using Postgrest.Attributes;
using Postgrest.Models;

namespace Jogging.Infrastructure.Models.DatabaseModels.Account;

[Table("Profile")]
public class Profile: BaseModel
{
        [PrimaryKey("id")]
        public string Id { get; set; }
        [Column("role")]
        public string Role { get; set; }
}
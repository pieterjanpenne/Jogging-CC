using Newtonsoft.Json;

namespace Jogging.Infrastructure.Models.SearchModels.Person;

public class ExtendedPersonSearch
{
    [JsonProperty("person_id")]
    public int PersonId { get; set; }
    
    [JsonProperty("last_name")]
    public string LastName { get; set; }
    
    [JsonProperty("first_name")]
    public string FirstName { get; set; }
    
    [JsonProperty("birth_date")]
    public DateOnly BirthDate { get; set; }
    
    [JsonProperty("iban_number")]
    public string IbanNumber { get; set; }
    
    [JsonProperty("school_id")]
    public int? SchoolId { get; set; }
    
    [JsonProperty("address_id")]
    public int AddressId { get; set; }
    
    [JsonProperty("gender")]
    public Char Gender { get; set; }
    
    [JsonProperty("email")]
    public string? Email { get; set; }
    
    [JsonProperty("user_id")]
    public string? UserId { get; set; }
    
    // Address fields
    [JsonProperty("street")]
    public string Street { get; set; }
    
    [JsonProperty("house_number")]
    public string HouseNumber { get; set; }
    
    [JsonProperty("city")]
    public string City { get; set; }
    
    [JsonProperty("zip_code")]
    public string ZipCode { get; set; }
    
    // Profile fields
    [JsonProperty("user_role")]
    public string Role { get; set; }
}
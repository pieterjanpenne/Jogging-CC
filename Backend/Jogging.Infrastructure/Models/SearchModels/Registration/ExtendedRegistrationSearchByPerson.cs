using Newtonsoft.Json;

namespace Jogging.Infrastructure.Models.SearchModels.Registration;
public class ExtendedRegistrationSearchByPerson
{
    // Registration fields
    [JsonProperty("registration_id")]
    public int RegistrationId { get; set; }
    
    [JsonProperty("run_number")]
    public short? RunNumber { get; set; }
    
    [JsonProperty("run_time")]
    public TimeSpan? RunTime { get; set; }
    
    [JsonProperty("competition_per_category_id")]
    public int CompetitionPerCategoryId { get; set; }
    
    [JsonProperty("paid")]
    public bool? Paid { get; set; }
    
    [JsonProperty("person_id")]
    public int PersonId { get; set; }
    
    [JsonProperty("competition_id")]
    public int CompetitionId { get; set; }
    
    // CompetitionPerCategory fields
    [JsonProperty("distance_name")]
    public string DistanceName { get; set; }
    
    // Person fields
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
}
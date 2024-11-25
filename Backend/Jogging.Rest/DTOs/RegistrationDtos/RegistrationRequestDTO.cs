using Jogging.Rest.DTOs.PersonDtos;

namespace Jogging.Rest.DTOs.RegistrationDtos;

public class RegistrationRequestDTO
{
    public int PersonId { get; set; }
    public string DistanceName { get; set; }

    public int CompetitionId { get; set; }
    private string _email;

    public string? Email
    {
        get => _email;
        set => _email = value?.ToLower()?.Trim() ?? string.Empty;
    }
    
    public PersonRequestDTO? Person { get; set; }
}
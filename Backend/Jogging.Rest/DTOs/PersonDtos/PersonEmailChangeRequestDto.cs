namespace Jogging.Rest.DTOs.PersonDtos;

public class PersonEmailChangeRequestDto
{
    private string? _email;

    public string? Email
    {
        get => _email;
        set => _email = string.IsNullOrWhiteSpace(value) ? null : value.Trim().ToLower();
    }
}
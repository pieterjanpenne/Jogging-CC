namespace Jogging.Rest.DTOs.AddressDtos;

public class AddressResponseDTO
{
    public int Id { get; set; }
    public string? HouseNumber { get; set; }
    public string? Street { get; set; }
    public string? ZipCode { get; set; }
    public string City { get; set; }

    //public List<PersonResponseDTO> People { get; set; }
    //public List<CompetitionResponseDTO> Competitions { get; set; }
}
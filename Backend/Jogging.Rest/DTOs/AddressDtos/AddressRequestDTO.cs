namespace Jogging.Rest.DTOs.AddressDtos;

public class AddressRequestDTO
{
    public string? HouseNumber { get; set; }
    public string? Street { get; set; }
    public string? ZipCode { get; set; }
    public string City { get; set; }
}
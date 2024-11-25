using Jogging.Rest.DTOs.PersonDtos;

namespace Jogging.Rest.DTOs.SchoolDtos;

public class SchoolResponseDTO
{
    public int Id { get; set; }
    public string Name { get; set; }

    public List<PersonResponseDTO> People { get; set; }
}
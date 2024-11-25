using Jogging.Rest.DTOs.AddressDtos;
using Jogging.Rest.DTOs.SchoolDtos;

namespace Jogging.Rest.DTOs.PersonDtos
{
    public class PersonRequestDTO
    {
        public string LastName { get; set; }
        
        public string FirstName { get; set; }
        
        public DateOnly BirthDate { get; set; }
        
        public string? IBANNumber { get; set; }
        
        public Char Gender { get; set; }

        public SchoolRequestDTO? School { get; set; }

        public AddressRequestDTO? Address { get; set; }
    }
}
using Jogging.Rest.DTOs.AccountDtos.ProfileDtos;
using Jogging.Rest.DTOs.AddressDtos;
using Jogging.Rest.DTOs.SchoolDtos;

namespace Jogging.Rest.DTOs.PersonDtos
{
    public class PersonResponseDTO
    {
        public int? Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public DateOnly BirthDate { get; set; }
        public string? IBANNumber { get; set; }
        public Char Gender { get; set; }
        public string? Email { get; set; }

        public ProfileResponseDTO? Profile { get; set; }
        
        public SchoolResponseDTO? School { get; set; }

        public AddressResponseDTO? Address { get; set; }

        public Guid? UserId { get; set; }
    }
}
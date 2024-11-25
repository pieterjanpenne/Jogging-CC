using Jogging.Domain.Exceptions;
using Jogging.Domain.Models;

namespace Jogging.Domain.Validators
{
    public static class PersonValidator
    {
        public static void ValidatePersonRequest(PersonDom person)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(person.FirstName) ||
                    string.IsNullOrWhiteSpace(person.LastName) ||
                    string.IsNullOrWhiteSpace(person.Gender.ToString()) ||
                    (person.Gender.ToString().ToLower() != "m" &&
                     person.Gender.ToString().ToLower() != "v"))
                {
                    throw new PersonDataException("Firstname, lastname, gender, and birthdate are required.");
                }

                int minAllowedAge = 0;
                if (person.Age < minAllowedAge)
                {
                    throw new PersonDataException("Registration is only allowed from 16 and up.");
                }

                if (person.BirthDate > DateOnly.FromDateTime(DateTime.Today))
                {
                    throw new PersonDataException("Birthdate cannot be in the future.");
                }

                int maxAllowedAge = 150;
                if (DateTime.Now.Year - person.BirthDate.Year > maxAllowedAge)
                {
                    throw new PersonDataException($"Birthdate cannot be more than {maxAllowedAge} years ago.");
                }
            }
            catch (PersonDataException)
            {
                throw; // Re-throw InvalidPersonDataException without wrapping other exceptions
            }
            catch (Exception exception)
            {
                // Wrap other exceptions in InvalidPersonDataException
                throw new PersonDataException("The person data was not valid.", exception);
            }
        }

        public static void ValidatePersonRole(string role)
        {
            if (role != "Admin" && role != "User")
            {
                throw new RoleException("The only possible roles are Admin and User.");
            }
        }
    }
}
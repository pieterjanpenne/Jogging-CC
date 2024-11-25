using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions
{
    public class RegistrationAlreadyExistsException : Exception
    {
        public RegistrationAlreadyExistsException()
        {
        }

        public RegistrationAlreadyExistsException(string? message) : base(message)
        {
        }

        public RegistrationAlreadyExistsException(string? message, Exception? innerException) : base(message, innerException)
        {
        }

        protected RegistrationAlreadyExistsException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
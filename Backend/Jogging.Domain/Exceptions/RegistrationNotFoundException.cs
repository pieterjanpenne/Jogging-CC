using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions
{
    public class RegistrationNotFoundException : Exception
    {
        public RegistrationNotFoundException()
        {
        }

        public RegistrationNotFoundException(string? message) : base(message)
        {
        }

        public RegistrationNotFoundException(string? message, Exception? innerException) : base(message, innerException)
        {
        }

        protected RegistrationNotFoundException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
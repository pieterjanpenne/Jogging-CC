using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions
{
    public class PersonException : Exception
    {
        public PersonException()
        {
        }

        public PersonException(string? message) : base(message)
        {
        }

        public PersonException(string? message, Exception? innerException) : base(message, innerException)
        {
        }

        protected PersonException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
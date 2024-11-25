using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class PersonRegistrationException : Exception
{
    public PersonRegistrationException()
    {
    }

    protected PersonRegistrationException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public PersonRegistrationException(string? message) : base(message)
    {
    }

    public PersonRegistrationException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
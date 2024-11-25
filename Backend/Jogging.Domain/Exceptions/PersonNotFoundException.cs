using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class PersonNotFoundException : Exception
{
    public PersonNotFoundException()
    {
    }

    protected PersonNotFoundException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public PersonNotFoundException(string? message) : base(message)
    {
    }

    public PersonNotFoundException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
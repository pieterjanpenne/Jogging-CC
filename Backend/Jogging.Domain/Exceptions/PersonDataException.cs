using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class PersonDataException: Exception
{
    public PersonDataException()
    {
    }

    protected PersonDataException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public PersonDataException(string? message) : base(message)
    {
    }

    public PersonDataException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
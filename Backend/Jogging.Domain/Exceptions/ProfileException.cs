using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class ProfileException : Exception
{
    public ProfileException()
    {
    }

    protected ProfileException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public ProfileException(string? message) : base(message)
    {
    }

    public ProfileException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
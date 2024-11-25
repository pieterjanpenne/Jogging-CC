using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class SchoolException : Exception
{
    public SchoolException()
    {
    }

    protected SchoolException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public SchoolException(string? message) : base(message)
    {
    }

    public SchoolException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
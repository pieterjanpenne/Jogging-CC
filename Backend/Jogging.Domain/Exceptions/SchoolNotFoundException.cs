using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class SchoolNotFoundException : Exception
{
    public SchoolNotFoundException()
    {
    }

    protected SchoolNotFoundException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public SchoolNotFoundException(string? message) : base(message)
    {
    }

    public SchoolNotFoundException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
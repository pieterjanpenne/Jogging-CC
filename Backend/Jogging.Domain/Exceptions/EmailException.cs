using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class EmailException : Exception
{
    public EmailException()
    {
    }

    protected EmailException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public EmailException(string? message) : base(message)
    {
    }

    public EmailException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
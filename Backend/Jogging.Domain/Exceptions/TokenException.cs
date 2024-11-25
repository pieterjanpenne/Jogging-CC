using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class TokenException : Exception
{
    public TokenException()
    {
    }

    protected TokenException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public TokenException(string? message) : base(message)
    {
    }

    public TokenException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class PasswordException : Exception
{
    public PasswordException()
    {
    }

    protected PasswordException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public PasswordException(string? message) : base(message)
    {
    }

    public PasswordException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
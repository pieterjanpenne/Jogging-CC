using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class RoleException : Exception
{
    public RoleException()
    {
    }

    protected RoleException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public RoleException(string? message) : base(message)
    {
    }

    public RoleException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
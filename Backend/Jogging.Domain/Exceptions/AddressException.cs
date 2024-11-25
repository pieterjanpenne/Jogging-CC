using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class AddressException : Exception
{
    public AddressException()
    {
    }

    protected AddressException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public AddressException(string? message) : base(message)
    {
    }

    public AddressException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
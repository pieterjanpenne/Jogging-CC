using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class DistanceException : Exception
{
    public DistanceException()
    {
    }

    protected DistanceException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public DistanceException(string? message) : base(message)
    {
    }

    public DistanceException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
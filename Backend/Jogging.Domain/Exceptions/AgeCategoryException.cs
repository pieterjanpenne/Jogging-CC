using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class AgeCategoryException : Exception
{
    public AgeCategoryException()
    {
    }

    protected AgeCategoryException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public AgeCategoryException(string? message) : base(message)
    {
    }

    public AgeCategoryException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
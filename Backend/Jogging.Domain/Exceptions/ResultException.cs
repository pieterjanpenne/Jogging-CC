using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class ResultException : Exception
{
    public ResultException()
    {
    }

    protected ResultException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public ResultException(string? message) : base(message)
    {
    }

    public ResultException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
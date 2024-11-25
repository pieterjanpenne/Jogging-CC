using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class RankingException : Exception
{
    public RankingException()
    {
    }

    protected RankingException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public RankingException(string? message) : base(message)
    {
    }

    public RankingException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
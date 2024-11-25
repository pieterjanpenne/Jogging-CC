using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class CompetitionPerCategoryException : Exception
{
    public CompetitionPerCategoryException()
    {
    }

    protected CompetitionPerCategoryException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public CompetitionPerCategoryException(string? message) : base(message)
    {
    }

    public CompetitionPerCategoryException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
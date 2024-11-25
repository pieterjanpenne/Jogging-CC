using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class DuplicateEmailException : Exception
{
    public DuplicateEmailException()
    {
    }

    protected DuplicateEmailException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public DuplicateEmailException(string? message) : base(message)
    {
    }

    public DuplicateEmailException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
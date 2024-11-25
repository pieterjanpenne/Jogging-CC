using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions;

public class PaymentException : Exception
{
    public PaymentException()
    {
    }

    protected PaymentException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }

    public PaymentException(string? message) : base(message)
    {
    }

    public PaymentException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
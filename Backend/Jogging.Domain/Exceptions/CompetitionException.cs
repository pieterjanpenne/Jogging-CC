using System.Runtime.Serialization;

namespace Jogging.Domain.Exceptions
{
    public class CompetitionException : Exception
    {
        public CompetitionException()
        {
        }

        public CompetitionException(string? message) : base(message)
        {
        }

        public CompetitionException(string? message, Exception? innerException) : base(message, innerException)
        {
        }

        protected CompetitionException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}

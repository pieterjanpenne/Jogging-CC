namespace Jogging.Contracts.Helpers
{

    public abstract class QueryStringParameters
    {
        const int _maxPageSize = 3000;
        public int PageNumber { get; set; } = 1;

        private int _pageSize = 10;
        public int PageSize
        {
            get
            {
                return _pageSize;
            }
            set
            {
                _pageSize = value > _maxPageSize ? _maxPageSize : value;
            }
        }

        public string? OrderBy { get; set; }
    }
}
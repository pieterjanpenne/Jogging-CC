namespace Jogging.Domain.Helpers
{
    public interface ISortHelper<T>
    {
        IQueryable<T> ApplySort(ref IQueryable<T> entities, string? orderByQueryString);
    }
}
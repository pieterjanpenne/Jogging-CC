namespace Jogging.Contracts.Interfaces.RepoInterfaces
{
    public interface IGenericResultRepo<T, R> where T : class where R : class
    {
        public Task<IQueryable<T>> GetByIdAsync(int id);
        public Task UpdateRunTimeAsync(int id, R result);
    }
}
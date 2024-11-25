namespace Jogging.Domain.Interfaces.RepositoryInterfaces
{
    public interface IGenericRepo<T> where T : class
    {
        //crud

        public Task<T> AddAsync(T person);

        public Task<List<T>> GetAllAsync();

        public Task<T> GetByIdAsync(int id);

        public Task<T> UpdateAsync(int id, T updatedItem);
        public Task<T> UpsertAsync(int? id, T updatedItem);
        
        public Task DeleteAsync(int id);
    }
}
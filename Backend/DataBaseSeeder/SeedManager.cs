using Jogging.Infrastructure.Models;
using Jogging.Infrastructure.Models.DatabaseModels.AgeCategory;
using Supabase;

namespace DataBaseSeeder
{
    public class SeedManager
    {
        private readonly Supabase.Client _client;

        public SeedManager(Client client)
        {
            _client = client;
        }

        public void Seed()
        {
            //seed here
            SeedAgeCategories();
        }

        private void deleteAgeCategories()
        {
            var result = _client.From<SimpleAgeCategory>().Get();
            foreach (var ageCategory in result.Result.Models)
            {
                _client.From<SimpleAgeCategory>().Delete(ageCategory);
            }
        }

        private void SeedAgeCategories()
        {
            List<SimpleAgeCategory> newAgeCategories = new() { new SimpleAgeCategory() { Name = "min40", MinimumAge = 0, MaximumAge = 39 }, new SimpleAgeCategory() { Name = "plus40", MinimumAge = 40, MaximumAge = 49 }, new SimpleAgeCategory() { Name = "plus50", MinimumAge = 50, MaximumAge = 59 }, new SimpleAgeCategory() { Name = "plus60", MinimumAge = 60, MaximumAge = 150 } };
            foreach (var newAgeCategory in newAgeCategories)
            {
                _client.From<SimpleAgeCategory>().Insert(newAgeCategory);
            }
        }

        public void Reset()
        {
            //delete old data
            deleteAgeCategories();
            Seed();
        }
    }
}
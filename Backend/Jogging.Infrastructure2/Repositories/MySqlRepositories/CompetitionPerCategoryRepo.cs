using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Jogging.Domain.Enums;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Infrastructure2.Data;
using Jogging.Infrastructure2.Models;
using Microsoft.EntityFrameworkCore;

namespace Jogging.Infrastructure.Repositories.MySqlRepos
{
    public class CompetitionPerCategoryRepo : ICompetitionPerCategoryRepo
    {
        private readonly JoggingCcContext _dbContext;
        private readonly IAgeCategoryRepo _ageCategoryRepo;
        private readonly IMapper _mapper;

        public CompetitionPerCategoryRepo(JoggingCcContext dbContext, IAgeCategoryRepo ageCategoryRepo, IMapper mapper)
        {
            _dbContext = dbContext;
            _ageCategoryRepo = ageCategoryRepo;
            _mapper = mapper;
        }

        public async Task<List<CompetitionPerCategoryDom>> UpdateAsync(Dictionary<string, float> distances, int competitionId)
        {
            var competitionPerCategories = await _dbContext.CompetitionPerCategories
                .Where(cpc => cpc.CompetitionId == competitionId)
                .ToListAsync();

            foreach (var distance in distances)
            {
                var categoryToUpdate = competitionPerCategories.FirstOrDefault(cpc => cpc.DistanceName == distance.Key);
                if (categoryToUpdate != null)
                {
                    categoryToUpdate.DistanceInKm = distance.Value;
                }
            }

            await _dbContext.SaveChangesAsync();

            return _mapper.Map<List<CompetitionPerCategoryDom>>(competitionPerCategories);
        }

        public async Task DeleteAsync(int competitionPerCategoryId)
        {
            var competitionPerCategory = await _dbContext.CompetitionPerCategories
                .FirstOrDefaultAsync(cpc => cpc.Id == competitionPerCategoryId);

            if (competitionPerCategory == null)
            {
                throw new CompetitionException("Competition per category not found");
            }

            _dbContext.CompetitionPerCategories.Remove(competitionPerCategory);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<CompetitionPerCategoryDom>> AddAsync(Dictionary<string, float> distances, int competitionId)
        {
            var ageCategories = await _ageCategoryRepo.GetAllAsync();
            List<CompetitionPerCategoryEF> competitionPerCategories = new List<CompetitionPerCategoryEF>();

            foreach (var ageCategory in ageCategories)
            {
                foreach (var distance in distances.OrderBy(d => d.Value))
                {
                    foreach (var gender in (Genders[])Enum.GetValues(typeof(Genders)))
                    {
                        competitionPerCategories.Add(new CompetitionPerCategoryEF
                        {
                            DistanceName = distance.Key,
                            DistanceInKm = distance.Value,
                            AgeCategoryId = ageCategory.Id,
                            CompetitionId = competitionId,
                            Gender = gender.ToString(),
                        });
                    }
                }
            }

            await _dbContext.CompetitionPerCategories.AddRangeAsync(competitionPerCategories);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<List<CompetitionPerCategoryDom>>(competitionPerCategories);
        }

        public async Task UpdateGunTimeAsync(int competitionId, DateTime gunTime)
        {
            var competitionPerCategories = await _dbContext.CompetitionPerCategories
                .Where(cpc => cpc.CompetitionId == competitionId)
                .ToListAsync();

            if (!competitionPerCategories.Any())
            {
                throw new CompetitionException("Competition not found");
            }

            competitionPerCategories.ForEach(cpc => cpc.GunTime = gunTime);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<CompetitionPerCategoryDom> GetCompetitionPerCategoryByParameters(int ageCategoryId, string distanceName, char personGender, int competitionId)
        {
            var competitionPerCategory = await _dbContext.CompetitionPerCategories
                .FirstOrDefaultAsync(cpc =>
                    cpc.AgeCategoryId == ageCategoryId &&
                    cpc.DistanceName == distanceName &&
                    cpc.CompetitionId == competitionId &&
                    cpc.Gender == personGender.ToString().ToUpper());

            if (competitionPerCategory == null)
            {
                throw new CompetitionException("This competition per category doesn't exist");
            }

            return _mapper.Map<CompetitionPerCategoryDom>(competitionPerCategory);
        }

        public Task<CompetitionPerCategoryDom> AddAsync(CompetitionPerCategoryDom person)
        {
            throw new NotImplementedException();
        }

        public Task<List<CompetitionPerCategoryDom>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<CompetitionPerCategoryDom> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<CompetitionPerCategoryDom> UpdateAsync(int id, CompetitionPerCategoryDom updatedItem)
        {
            throw new NotImplementedException();
        }

        public Task<CompetitionPerCategoryDom> UpsertAsync(int? id, CompetitionPerCategoryDom updatedItem)
        {
            throw new NotImplementedException();
        }
    }
}

using AutoMapper;
using Jogging.Domain.DomainManagers;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Infrastructure2.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Postgrest;
using Postgrest.Interfaces;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Jogging.Infrastructure.Repositories.SupabaseRepos
{
    public class CompetitionRepo : ICompetitionRepo
    {
        private readonly JoggingCcContext _context;
        private readonly IGenericRepo<AddressDom> _addressRepo;
        private readonly ICompetitionPerCategoryRepo _competitionPerCategoryRepo;
        private readonly IMapper _mapper;
        private readonly CustomMemoryCache _memoryCache;

        public CompetitionRepo(JoggingCcContext context, IGenericRepo<AddressDom> addressRepo, ICompetitionPerCategoryRepo competitionPerCategoryRepo,
            IMapper mapper, CustomMemoryCache memoryCache)
        {
            _context = context;
            _addressRepo = addressRepo;
            _competitionPerCategoryRepo = competitionPerCategoryRepo;
            _mapper = mapper;
            _memoryCache = memoryCache;
        }

        public async Task<List<CompetitionDom>> GetAllAsync()
        {
            return _mapper.Map<List<CompetitionDom>>(await _context.Competitions.ToListAsync());
        }

        public async Task<List<CompetitionDom>> GetAllWithSearchValuesAsync(string? competitionName, DateOnly? startDate, DateOnly? endDate)
        {
            var query = _context.Competitions.AsQueryable();
            if (!string.IsNullOrEmpty(competitionName))
            {
                query.Where(c => EF.Functions.Like(c.Name, $"{competitionName}"));
            }

            if (startDate.HasValue)
            {
                var startDateTime = startDate.Value.ToDateTime(TimeOnly.MinValue);
                query = query.Where(c => c.Date >= startDateTime);
            }

            if (endDate.HasValue)
            {
                var endDateTime = endDate.Value.ToDateTime(TimeOnly.MinValue);
                query = query.Where(c => c.Date <= endDateTime);
            }

            return _mapper.Map<List<CompetitionDom>>(await query.ToListAsync());
        }
        public async Task<List<CompetitionDom>> GetAllActiveAsync()
        {
            return _mapper.Map<List<CompetitionDom>>(
                await _context.Competitions.Where(c => c.Active == true).ToListAsync()
            );
        }

        public async Task<List<CompetitionDom>> GetAllActiveWithSearchValuesAsync(string? competitionName, DateOnly? startDate, DateOnly? endDate)
        {
            throw new NotImplementedException();

        }

        public async Task<List<CompetitionDom>> GetAllActiveRankingAsync()
        {
            throw new NotImplementedException();

        }

        public async Task<CompetitionDom> GetSimpleCompetitionByIdAsync(int competitionId)
        {
            throw new NotImplementedException();

        }

        public async Task<CompetitionDom> GetByIdAsync(int competitionId)
        {
            var competition = await GetExtendedCompetitionById(competitionId);

            return _mapper.Map<CompetitionDom>(competition);
        }

        public async Task<CompetitionDom> AddAsync(CompetitionDom competitionDom)
        {
            throw new NotImplementedException();

        }

        public async Task<CompetitionDom> UpdateAsync(int competitionId, CompetitionDom updatedCompetition)
        {
            var currentCompetition = await GetExtendedCompetitionById(competitionId);

            var isAddressUpdated = await UpdateAddressIfNeeded(currentCompetition, updatedCompetition.Address);
            var isDistancesUpdated = await UpdateDistancesIfNeeded(currentCompetition, updatedCompetition);

            if (isAddressUpdated || isDistancesUpdated || !_mapper.Map<CompetitionDom>(currentCompetition).Equals(updatedCompetition))
            {
                currentCompetition.Name = updatedCompetition.Name;
                currentCompetition.Information = updatedCompetition.Information;
                currentCompetition.Date = updatedCompetition.Date;
                currentCompetition.Active = updatedCompetition.Active;
                if (currentCompetition.RankingActive != updatedCompetition.RankingActive)
                {
                    _memoryCache.Remove(CacheKeyGenerator.GetAllResultsKey());
                }

                currentCompetition.RankingActive = updatedCompetition.RankingActive;

                var competition = await currentCompetition.Update<ExtendedCompetition>();

                if (competition.Model == null)
                {
                    throw new CompetitionException("Something went wrong while updating your competition");
                }

                return _mapper.Map<CompetitionDom>(competition.Model);
            }

            return _mapper.Map<CompetitionDom>(currentCompetition);
        }

        public async Task DeleteAsync(int competitionId)
        {
            throw new NotImplementedException();
        }

        private async Task<ExtendedCompetition> GetExtendedCompetitionById(int competitionId)
        {
            throw new NotImplementedException();
        }

        private async Task<bool> UpdateAddressIfNeeded(ExtendedCompetition competition, AddressDom updatedAddress)
        {
            throw new NotImplementedException();
        }

        private async Task<bool> UpdateDistancesIfNeeded(ExtendedCompetition competition, CompetitionDom updatedCompetitionDom)
        {
            throw new NotImplementedException();
        }

        public Task<CompetitionDom> UpsertAsync(int? addressId, CompetitionDom updatedItem)
        {
            throw new NotImplementedException();
        }
    }
}
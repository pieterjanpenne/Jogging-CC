using AutoMapper;
using Jogging.Domain.DomainManagers;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Infrastructure2.Data;
using Jogging.Infrastructure2.Models;
using Jogging.Infrastructure2.Models.CompetitionPerCategory;
using Jogging.Infrastructure2.Models.DatabaseModels.Competition;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Net;
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
            try
            {
                return _mapper.Map<List<CompetitionDom>>(await _context.Competitions.ToListAsync());
            }
            catch (Exception ex)
            {
                throw new Exception($"GetAllAsync: {ex.Message}");
            }
        }

        public async Task<List<CompetitionDom>> GetAllWithSearchValuesAsync(string? competitionName, DateOnly? startDate, DateOnly? endDate)
        {
            try
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
            catch (Exception ex)
            {
                throw new Exception($"GetAllWithSearchValuesAsync: {ex.Message}");
            }
        }

        public async Task<List<CompetitionDom>> GetAllActiveAsync()
        {
            try
            {

                return _mapper.Map<List<CompetitionDom>>(
                    await _context.Competitions.Where(c => c.Active == true).ToListAsync()
                );
            }
            catch (Exception ex)
            {
                throw new Exception($"GetAllActiveAsync: {ex.Message}");
            }
        }

        public async Task<List<CompetitionDom>> GetAllActiveWithSearchValuesAsync(string? competitionName, DateOnly? startDate, DateOnly? endDate)
        {
            try
            {
                var query = _context.Competitions.AsQueryable();

                if (!string.IsNullOrEmpty(competitionName))
                    query = query.Where(c => EF.Functions.Like(c.Name, $"%{competitionName}%"));

                if (startDate.HasValue)
                    query = query.Where(c => c.Date >= startDate.Value.ToDateTime(TimeOnly.MinValue));

                if (endDate.HasValue)
                    query = query.Where(c => c.Date <= endDate.Value.ToDateTime(TimeOnly.MinValue));

                var competitions = await query
                    .OrderBy(c => c.Date)
                    .ToListAsync();

                if (competitions.Count == 0)
                    throw new Exception("No competitions found");

                return _mapper.Map<List<CompetitionDom>>(competitions);
            }
            catch (Exception ex)
            {
                throw new Exception($"GetAllActiveWithSearchValuesAsync: {ex.Message}");
            }
        }

        public async Task<List<CompetitionDom>> GetAllActiveRankingAsync()
        {
            try
            {
                return _mapper.Map<List<CompetitionDom>>(await _context.Competitions.Where(c => c.RankingActive == true).ToListAsync());
            }
            catch (Exception ex)
            {
                throw new Exception($"GetAllActiveRankingAsync: {ex.Message}");
            }
        }

        public async Task<CompetitionDom> GetSimpleCompetitionByIdAsync(int competitionId)
        {
            try
            {
                return _mapper.Map<CompetitionDom>(await _context.Competitions.FindAsync(competitionId));
            }
            catch (Exception ex)
            {
                throw new Exception($"GetSimpleCompetitionByIdAsync: {ex.Message}");
            }
        }

        public async Task<CompetitionDom> GetByIdAsync(int competitionId)
        {
            try
            {
                var competition = await GetExtendedCompetitionById(competitionId);

                return _mapper.Map<CompetitionDom>(competition);
            }
            catch (Exception ex)
            {
                throw new Exception($"GetByIdAsync: {ex.Message}");
            }
        }

        public async Task<CompetitionDom> AddAsync(CompetitionDom competitionDom)
        {
            try
            {
                await _context.Competitions.AddAsync(_mapper.Map<CompetitionEF>(competitionDom));
                await _context.SaveChangesAsync();

                return competitionDom;
            }
            catch (Exception ex)
            {
                throw new Exception($"AddAsync: {ex.Message}");
            }
        }

        public async Task<CompetitionDom> UpdateAsync(int competitionId, CompetitionDom updatedCompetition)
        {
            var currentCompetition = await _context.Competitions.FindAsync(competitionId);

            if (currentCompetition == null) throw new CompetitionException("Competition not found");

            bool hasChanges =
                 currentCompetition.Name != updatedCompetition.Name ||
                 currentCompetition.Information != updatedCompetition.Information ||
                 currentCompetition.Date != updatedCompetition.Date ||
                 currentCompetition.Active != updatedCompetition.Active ||
                 currentCompetition.RankingActive != updatedCompetition.RankingActive;

            if (hasChanges)
            {
                if (currentCompetition.RankingActive != updatedCompetition.RankingActive)
                    _memoryCache.Remove(CacheKeyGenerator.GetAllResultsKey());

                _mapper.Map(updatedCompetition, currentCompetition);

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    throw new Exception("Failed to update competition", ex);
                }
            }

            return _mapper.Map<CompetitionDom>(currentCompetition);
        }

        public async Task DeleteAsync(int competitionId)
        {
            try
            {
                _context.Competitions.Remove(_mapper.Map<CompetitionEF>(_context.Competitions.Find(competitionId)));
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"DeleteAsync: {ex.Message}");
            }
        }

        private async Task<ExtendedCompetition> GetExtendedCompetitionById(int competitionId)
        {
            try
            {
                return _mapper.Map<ExtendedCompetition>(await _context.Competitions.FindAsync(competitionId));
            }
            catch (Exception ex)
            {
                throw new Exception($"GetExtendedCompetitionById: {ex.Message}");
            }
        }

        private async Task<bool> UpdateAddressIfNeeded(ExtendedCompetition competition, AddressDom updatedAddress)
        {
            if (updatedAddress == null) return false;

            bool addressChanged = competition.Address == null || !_mapper.Map<AddressDom>(competition.Address).Equals(updatedAddress);

            if (addressChanged)
            {
                var address = await _context.Addresses
                    .FirstOrDefaultAsync(a =>
                        a.Street == updatedAddress.Street &&
                        a.City == updatedAddress.City);

                if (address == null)
                {
                    address = _mapper.Map<AddressEF>(updatedAddress);
                    _context.Addresses.Add(address);
                }
                else
                {
                    _mapper.Map(updatedAddress, address);
                }

                await _context.SaveChangesAsync();

                competition.AddressId = address.Id;
                competition.Address = address;

                return true;
            }

            return false;
        }

        private async Task<bool> UpdateDistancesIfNeeded(ExtendedCompetition competition, CompetitionDom updatedCompetitionDom)
        {
            var competitionPerCategories = await _competitionPerCategoryRepo.UpdateAsync(updatedCompetitionDom.Distances, competition.Id);
            competition.CompetitionPerCategories = _mapper.Map<List<ExtendedCompetitionPerCategory>>(competitionPerCategories);
            return true;
        }

        public Task<CompetitionDom> UpsertAsync(int? addressId, CompetitionDom updatedItem)
        {
            throw new NotImplementedException();
        }
    }
}
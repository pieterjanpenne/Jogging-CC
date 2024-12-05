using AutoMapper;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Domain.Validators;
using Jogging.Infrastructure2.Data;
using Microsoft.EntityFrameworkCore;
using Supabase;

namespace Jogging.Infrastructure.Repositories.SupabaseRepos;

public class ProfileRepo: IProfileRepo
{
    private readonly JoggingCcContext _context;
    private readonly IMapper _mapper;

    public ProfileRepo(JoggingCcContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    public async Task UpdateAsync(string userId, ProfileDom updatedItem)
    {
        /*
        var profile = await _context.Profiles
        .FirstOrDefaultAsync(p => p.Id == userId);

        if (profile == null)
        {
            throw new ProfileException("Profile not found.");
        }

        try
        {
            profile.Role = updatedItem.Role;
            _context.Profiles.Update(profile);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new Exception($"UpdateAsync: {ex.Message}");
        }
        */

        // Onzeker door die id's
        throw new NotImplementedException();
    }
}
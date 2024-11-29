using AutoMapper;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Domain.Validators;
using Supabase;
using Profile = Jogging.Infrastructure.Models.DatabaseModels.Account.Profile;

namespace Jogging.Infrastructure.Repositories.SupabaseRepos;

public class ProfileRepo: IProfileRepo
{
    private readonly Client _client;
    private readonly IMapper _mapper;

    public ProfileRepo(Client client, IMapper mapper)
    {
        _client = client;
        _mapper = mapper;
    }
    
    public async Task UpdateAsync(string userId, ProfileDom updatedItem)
    {
        var updatedProfile = await _client.From<Profile>()
            .Where(p => p.Id == userId)
            .Set(p => p.Role, updatedItem.Role)
            .Update();

        if (updatedProfile.Models.Count == 0)
        {
            throw new ProfileException("Error while updating user role.");
        }
    }
}
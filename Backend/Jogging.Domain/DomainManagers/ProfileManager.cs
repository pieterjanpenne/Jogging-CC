using Jogging.Domain.Exceptions;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Domain.Validators;

namespace Jogging.Domain.DomainManagers;

public class ProfileManager
{
    private readonly IProfileRepo _profileRepo;
    private readonly IPersonRepo _personRepo;

    public ProfileManager(IProfileRepo profileRepo, IPersonRepo personRepo)
    {
        _profileRepo = profileRepo;
        _personRepo = personRepo;
    }

    public async Task UpdateProfileAsync(int personId, ProfileDom profileDom)
    {
        PersonValidator.ValidatePersonRole(profileDom.Role);

        var person = await _personRepo.GetByIdAsync(personId);

        if (person.UserId == null)
        {
            throw new PersonException("This person doesn't have a profile");
        }
        await _profileRepo.UpdateAsync(person.UserId, profileDom);
    }
}
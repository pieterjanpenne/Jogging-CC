using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;

namespace Jogging.Domain.DomainManagers;

public class SchoolManager
{
    private readonly IGenericRepo<SchoolDom> _schoolRepo;

    public SchoolManager(IGenericRepo<SchoolDom> schoolRepo)
    {
        _schoolRepo = schoolRepo;
    }

    public async Task<PagedList<SchoolDom>> GetAll(QueryStringParameters parameters)
    {
        var schools = await _schoolRepo.GetAllAsync();

        if (!schools.Any())
        {
            throw new SchoolNotFoundException("No schools found");
        }

        return PagedList<SchoolDom>.ToPagedList(schools.AsQueryable(), parameters.PageNumber, parameters.PageSize);
    }

    public async Task<SchoolDom> GetById(int id)
    {
        var response = await _schoolRepo.GetByIdAsync(id);
        return response;
    }


    public async Task<SchoolDom> AddAsync(SchoolDom schoolRequestDom)
    {
        var school = await _schoolRepo.AddAsync(schoolRequestDom);
        return school;
    }

    public async Task<SchoolDom> UpdateAsync(int id, SchoolDom schoolRequestDom)
    {
        var school = await _schoolRepo.UpdateAsync(id, schoolRequestDom);
        return school;
    }

    public async Task DeleteAsync(int id)
    {
        await _schoolRepo.DeleteAsync(id);
    }
}
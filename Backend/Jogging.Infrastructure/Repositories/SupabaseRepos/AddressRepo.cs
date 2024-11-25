using AutoMapper;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Infrastructure.Models;
using Jogging.Infrastructure.Models.DatabaseModels.Address;
using Client = Supabase.Client;

namespace Jogging.Infrastructure.Repositories.SupabaseRepos;

public class AddressRepo : IGenericRepo<AddressDom>
{
    private readonly Client _client;
    private readonly IMapper _mapper;

    public AddressRepo(Client client, IMapper mapper)
    {
        _client = client;
        _mapper = mapper;
    }

    public async Task<List<AddressDom>> GetAllAsync()
    {
        var addresses = await _client
            .From<SimpleAddress>()
            .Get();

        if (addresses.Models.Count <= 0)
        {
            throw new AddressException("No addresses found");
        }

        return _mapper.Map<List<AddressDom>>(addresses.Models);
    }

    public async Task<AddressDom> GetByIdAsync(int id)
    {
        var address = await GetSimpleAddressByIdAsync(id);

        return _mapper.Map<AddressDom>(address);
    }

    public async Task<AddressDom> AddAsync(AddressDom addressDom)
    {
        var address = _mapper.Map<SimpleAddress>(addressDom);

        var response = await _client
            .From<SimpleAddress>()
            .Insert(address);

        if (response.Model == null)
        {
            throw new AddressException("Something went wrong while adding your address");
        }

        return _mapper.Map<AddressDom>(response.Model);
    }

    public async Task<AddressDom> UpsertAsync(int? addressId, AddressDom updatedAddressDom)
    {
        var updatedAddress = _mapper.Map<SimpleAddress>(updatedAddressDom);
        SimpleAddress? currentAddress;
        if (addressId.HasValue)
        {
            currentAddress = await GetSimpleAddressByIdAsync(addressId.Value);
        }
        else
        {
            currentAddress = await FindAddressByValues(updatedAddress);
        }

        if (currentAddress == null)
        {
            return await AddAsync(updatedAddressDom);
        }

        if (currentAddress.Equals(updatedAddress))
        {
            return _mapper.Map<AddressDom>(currentAddress);
        }

        currentAddress.Street = updatedAddress.Street;
        currentAddress.HouseNumber = updatedAddress.HouseNumber;
        currentAddress.City = updatedAddress.City;
        currentAddress.ZipCode = updatedAddress.ZipCode;

        var update = await currentAddress
            .Update<SimpleAddress>();

        if (update.Model == null)
        {
            throw new AddressException("Something went wrong while updating your address");
        }

        return _mapper.Map<AddressDom>(currentAddress);
    }

    public async Task<AddressDom> UpdateAsync(int addressId, AddressDom updatedAddressDom)
    {
        var currentAddress = await GetSimpleAddressByIdAsync(addressId);
        var currentAddressDom = _mapper.Map<AddressDom>(currentAddress);
        if (currentAddressDom.Equals(updatedAddressDom))
        {
            currentAddress.Street = updatedAddressDom.Street;
            currentAddress.HouseNumber = updatedAddressDom.HouseNumber;
            currentAddress.City = updatedAddressDom.City;
            currentAddress.ZipCode = updatedAddressDom.ZipCode;

            var update = await currentAddress
                .Update<SimpleAddress>();

            if (update.Model == null)
            {
                throw new AddressException("Something went wrong while updating your address");
            }

        }

        return _mapper.Map<AddressDom>(currentAddress);
    }

    public async Task DeleteAsync(int addressId)
    {
        await _client.From<SimpleAddress>()
            .Where(a => a.Id == addressId)
            .Delete();
    }

    private async Task<SimpleAddress> GetSimpleAddressByIdAsync(int addressId)
    {
        var address = await _client.From<SimpleAddress>()
            .Where(a => a.Id == addressId)
            .Limit(1)
            .Single();

        if (address == null)
        {
            throw new AddressException("No address found");
        }

        return address;
    }

    private async Task<SimpleAddress?> FindAddressByValues(SimpleAddress addressToFind)
    {
        return await _client
            .From<SimpleAddress>()
            .Where(a => a.Street == addressToFind.Street)
            .Where(a => a.HouseNumber == addressToFind.HouseNumber)
            .Where(a => a.ZipCode == addressToFind.ZipCode)
            .Where(a => a.City == addressToFind.City)
            .Limit(1)
            .Single();
    }
}
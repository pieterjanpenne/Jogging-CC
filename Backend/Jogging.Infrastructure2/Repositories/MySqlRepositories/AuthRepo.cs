using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Infrastructure2.Data;
using Jogging.Infrastructure2.Models;
using Jogging.Infrastructure2.Models.Account;
using Microsoft.EntityFrameworkCore;

namespace Jogging.Infrastructure.Repositories.MySqlRepos
{
    public class AuthRepo : IAuthenticationRepo
    {
        private readonly JoggingCcContext _dbContext;
        private readonly IMapper _mapper;

        public AuthRepo(JoggingCcContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<PersonDom> SignInAsync(string email, string password)
        {
            throw new NotImplementedException();
        }

        public async Task<string> SignUpAsync(string email, string? password)
        {
            throw new NotImplementedException();
        }

        public async Task ChangePassword(PasswordChangeDom passwordChangeInfo)
        {
            throw new NotImplementedException();

        }

        public async Task<string> ResetUserConfirmToken(string email)
        {
            throw new NotImplementedException();
        }

        public async Task ConfirmEmail(ConfirmTokenDom confirmTokenDom)
        {
            throw new NotImplementedException();
        }

        public async Task<string> ResetUserPasswordToken(string email)
        {
            throw new NotImplementedException();
        }

        public async Task CheckDuplicateEmailAddressAsync(string email)
        {
            var exists = await _dbContext.People.AnyAsync(p => p.Email == email);
            if (exists)
            {
                throw new DuplicateEmailException("This email address is already registered.");
            }
        }

        public async Task RemoveUserEmailAsync(string email)
        {
            var user = await _dbContext.People.FirstOrDefaultAsync(p => p.Email == email);
            if (user == null)
            {
                throw new PersonException("User not found");
            }

            _dbContext.People.Remove(user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateUserEmail(string oldEmail, string newEmail)
        {
            var user = await _dbContext.People.FirstOrDefaultAsync(p => p.Email == oldEmail);
            if (user == null)
            {
                throw new PersonException("User not found");
            }

            user.Email = newEmail;
            await _dbContext.SaveChangesAsync();
        }

        public async Task ResetPassword(PasswordResetDom passwordReset)
        {
            throw new NotImplementedException();
        }
    }
}

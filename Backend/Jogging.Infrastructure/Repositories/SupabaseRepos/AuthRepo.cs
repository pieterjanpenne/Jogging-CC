using AutoMapper;
using Jogging.Domain.Exceptions;
using Jogging.Domain.Helpers;
using Jogging.Domain.Interfaces.RepositoryInterfaces;
using Jogging.Domain.Models;
using Jogging.Infrastructure.Models.SearchModels.Account;
using Supabase.Gotrue;
using Client = Supabase.Client;

namespace Jogging.Infrastructure.Repositories.SupabaseRepos
{
    public class AuthRepo : IAuthenticationRepo
    {
        private readonly Client _client;
        private readonly IPersonRepo _personRepo;
        private readonly IMapper _mapper;


        public AuthRepo(Client client, IPersonRepo personRepo, IMapper mapper)
        {
            _client = client;
            _personRepo = personRepo;
            _mapper = mapper;
        }

        public async Task<PersonDom> SignInAsync(string email, string password)
        {
            var session = await _client.Auth.SignIn(email, password);

            if (session?.User?.Id == null)
            {
                throw new AuthException("The given user information was incorrect");
            }

            var person = await _personRepo.GetByGuidAsync(session.User.Id);

            if (person == null)
            {
                throw new PersonException("Something went wrong while getting your account information");
            }

            return _mapper.Map<PersonDom>(person);
        }

        public async Task<string> SignUpAsync(string email, string? password)
        {
            if (string.IsNullOrEmpty(password))
            {
                password = Guid.NewGuid().ToString().Substring(0, 8);
            }

            var session = await _client.Auth.SignUp(Constants.SignUpType.Email, email, password);

            if (session?.User?.Id == null)
            {
                throw new AuthException("Something went wrong while signing you up");
            }

            var userId = session.User.Id;

            return userId;
        }

        public async Task ChangePassword(PasswordChangeDom passwordChangeInfo)
        {
            var parameters = new Dictionary<string, object>
            {
                { "user_id", passwordChangeInfo.UserId },
                { "old_password", passwordChangeInfo.oldPassword },
                { "new_password", passwordChangeInfo.newPassword }
            };

            await _client.Rpc("update_user_password", parameters);
        }

        public async Task<string> ResetUserConfirmToken(string email)
        {
            string confirmToken = TokenGenerator.GenerateEmailToken(email);

            var parameters = new Dictionary<string, object>
            {
                { "confirm_token", confirmToken },
                { "email", email }
            };

            await _client.Rpc("set_email_confirm_token", parameters);

            return confirmToken;
        }

        public async Task ConfirmEmail(ConfirmTokenDom confirmTokenDom)
        {
            var parameters = new Dictionary<string, object>
            {
                { "confirm_token", confirmTokenDom.confirm_token }
            };

            await _client.Rpc("confirm_email", parameters);
        }

        public async Task<string> ResetUserPasswordToken(string email)
        {
            string resetToken = TokenGenerator.GenerateEmailToken(email);

            var parameters = new Dictionary<string, object>
            {
                { "recovery_token", resetToken },
                { "email", email }
            };

            await _client.Rpc("set_password_recovery_token", parameters);

            return resetToken;
        }

        public async Task CheckDuplicateEmailAddressAsync(string email)
        {
            var parameters = new Dictionary<string, object>
            {
                { "email_address", email }
            };

            var response = await _client.Rpc<SupabaseUser>("find_user_email", parameters);

            if (response?.email != null)
            {
                throw new DuplicateEmailException("This email address is already registered.");
            }
        }

        public async Task RemoveUserEmailAsync(string email)
        {
            var parameters = new Dictionary<string, object>
            {
                { "email_address", email }
            };

            await _client.Rpc("remove_user_email", parameters);
        }

        public async Task UpdateUserEmail(string oldEmail, string newEmail)
        {
            var parameters = new Dictionary<string, object>
            {
                { "old_email_address", oldEmail },
                { "new_email_address", newEmail }
            };

            await _client.Rpc("update_user_email", parameters);
        }

        public async Task ResetPassword(PasswordResetDom passwordReset)
        {
            var parameters = new Dictionary<string, object>
            {
                { "recovery_token", passwordReset.recovery_token },
                { "new_password", passwordReset.newPassword }
            };

            await _client.Rpc("update_user_password_recovery_token", parameters);
        }
    }
}
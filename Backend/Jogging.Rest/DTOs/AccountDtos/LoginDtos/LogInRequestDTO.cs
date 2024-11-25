namespace Jogging.Rest.DTOs.AccountDtos.LoginDtos
{
    public class LogInRequestDTO
    {
        private string _email;

        public string Email
        {
            get => _email;
            set => _email = value?.ToLower()?.Trim();
        }

        private string _password;

        public string Password
        {
            get => _password;
            set => _password = value?.Trim();
        }
    }
}
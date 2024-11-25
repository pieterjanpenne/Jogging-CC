using System.Net.Mail;
using Jogging.Domain.Configuration;
using Jogging.Domain.Helpers;
using Jogging.Domain.Models;
using Jogging.Domain.Validators;
using Microsoft.Extensions.DependencyInjection;

namespace Jogging.Domain.DomainManagers;

public class EmailManager
{
    private readonly EmailConfiguration _emailConfiguration;
    private readonly IServiceProvider _serviceProvider;


    public EmailManager(EmailConfiguration emailConfiguration, IServiceProvider serviceProvider)
    {
        _emailConfiguration = emailConfiguration;
        _serviceProvider = serviceProvider;
    }

    public void SendConfirmEmail(string email, string confirmToken, PersonDom person)
    {
        using var smtpClient = _serviceProvider.GetRequiredService<SmtpClient>();
        AuthenticationValidator.ValidateEmailInput(email);

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_emailConfiguration.Email),
            Subject = "Bevestig je aanmelding",
            Body = EmailBodyBuilders.CreateConfirmBody(confirmToken, person),
            IsBodyHtml = true
        };
        mailMessage.To.Add(new MailAddress(email));

        smtpClient.Send(mailMessage);
    }

    public void SendPasswordResetEmail(string email, string resetToken)
    {
        using var smtpClient = _serviceProvider.GetRequiredService<SmtpClient>();

        AuthenticationValidator.ValidateEmailInput(email);

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_emailConfiguration.Email),
            Subject = "Reset uw wachtwoord",
            Body = EmailBodyBuilders.CreatePasswordResetBody(resetToken),
            IsBodyHtml = true
        };
        mailMessage.To.Add(new MailAddress(email));

        smtpClient.Send(mailMessage);
    }

    public void SendRegistrationConfirmationEmail(string email, string resetToken, string userName, string? competitionName)
    {
        using var smtpClient = _serviceProvider.GetRequiredService<SmtpClient>();

        AuthenticationValidator.ValidateEmailInput(email);

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_emailConfiguration.Email),
            Subject = "Reset uw wachtwoord",
            Body = EmailBodyBuilders.CreateRegistrationInfoBody(resetToken, userName, competitionName),
            IsBodyHtml = true
        };
        mailMessage.To.Add(new MailAddress(email));

        smtpClient.Send(mailMessage);
    }

    public void SendPersonChangedEmail(PersonDom originalPerson, PersonDom updatedPerson)
    {
        Task.Run(() =>
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var smtpClient = scope.ServiceProvider.GetRequiredService<SmtpClient>();

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailConfiguration.Email),
                    Subject = "Persoon aangepast",
                    Body = EmailBodyBuilders.CreatePersonChangedInfoBody(originalPerson, updatedPerson),
                    IsBodyHtml = true
                };
                mailMessage.To.Add(new MailAddress("info@kozirunners.be"));

                smtpClient.Send(mailMessage);
            }
        });
    }

    public void SendEmailChangedMail(string email, string confirmToken, PersonDom person)
    {
        using var smtpClient = _serviceProvider.GetRequiredService<SmtpClient>();
        AuthenticationValidator.ValidateEmailInput(email);

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_emailConfiguration.Email),
            Subject = "Bevestig je nieuwe e-mailadres",
            Body = EmailBodyBuilders.CreateConfirmNewEmailBody(confirmToken, person),
            IsBodyHtml = true
        };
        mailMessage.To.Add(new MailAddress(email));

        smtpClient.Send(mailMessage);
    }
}
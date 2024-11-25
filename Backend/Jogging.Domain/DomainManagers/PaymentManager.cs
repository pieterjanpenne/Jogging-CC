using Jogging.Domain.Exceptions;
using Jogging.Domain.Models;
using MultiSafepay;
using MultiSafepay.Model;
using Newtonsoft.Json;

namespace Jogging.Domain.DomainManagers;

public class PaymentManager
{
    private readonly MultiSafepayClient _multiSafepayClient;
    private readonly RegistrationManager _registrationManager;

    public PaymentManager(MultiSafepayClient multiSafepayClient, RegistrationManager registrationManager)
    {
        _multiSafepayClient = multiSafepayClient;
        _registrationManager = registrationManager;
    }

    public async Task<string> CreatePaymentUrl(int personId, int competitionId)
    {
        var registration = await _registrationManager.GetRegistrationAsync(personId, competitionId);

        if (registration.Paid == true)
        {
            throw new PaymentException("You have already paid for this registration.");
        }

        var transactionId = Guid.NewGuid().ToString();
        var order = new Order
        {
            Type = OrderType.Redirect,
            OrderId = transactionId,
            GatewayId = "BANCONTACT",
            AmountInCents = 700,
            CurrencyCode = "EUR",
            Description = $"Betaling voor {registration.Competition.Name}",
            SecondsActive = 10 * 60,
            PaymentOptions = new PaymentOptions()
            {
                NotificationMethod = NotificationMethod.POST,
                NotificationUrl = "https://criterium.evergemsejoggings.be/api/Payment/notify",
                SuccessRedirectUrl = $"https://criterium.evergemsejoggings.be/wedstrijd/{competitionId}",
                CancelRedirectUrl = $"https://criterium.evergemsejoggings.be/wedstrijd/{competitionId}"
            },
            Customer = new Customer()
            {
                FirstName = registration.Person.FirstName,
                LastName = registration.Person.LastName,
                Locale = "BE"
            },
            Var1 = registration.Person.Id.ToString(),
            Var2 = competitionId.ToString()
        };

        var result = _multiSafepayClient.CustomOrder(order);

        return result.PaymentUrl;
    }

    public async Task ProcessPaymentNotification(PaymentNotificationDom notification)
    {
        var order = _multiSafepayClient.GetOrder(notification.transactionid);

        if (order.Status == "completed")
        {
            int userId = Int32.Parse(order.Var1);
            int competitionId = Int32.Parse(order.Var2);
            var registration = await _registrationManager.GetRegistrationAsync(userId, competitionId);
            registration.Paid = true;
            await _registrationManager.UpdatePaidAsync(registration.Id, registration);
        }
    }
}
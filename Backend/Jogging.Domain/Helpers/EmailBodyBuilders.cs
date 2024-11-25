using Jogging.Domain.Models;

namespace Jogging.Domain.Helpers
{
    public class EmailBodyBuilders
    {
        private static string CreateBodyHead(string title)
        {
            return $@"<head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>{title}</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }}
                    .container {{
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }}
                    .header {{
                        text-align: center;
                        padding: 10px 0;
                    }}
                    .header img {{
                        width: 154px;
                        height: 160px;
                    }}
                    .content {{
                        text-align: center;
                        padding: 20px 0;
                    }}
                    .content h2 {{
                        color: #4CAF50;
                    }}
                    .content p {{
                        font-size: 16px;
                        line-height: 1.5;
                    }}
                    .content a.button {{
                        display: inline-block;
                        padding: 10px 20px;
                        margin-top: 10px;
                        color: #fff;
                        background-color: #4CAF50;
                        text-decoration: none;
                        border-radius: 5px;
                    }}
                    .footer {{
                        text-align: center;
                        margin-top: 20px;
                        padding: 10px 0;
                    }}
                    .footer img {{
                        width: 123px;
                        height: 24px;
                    }}
                </style>
            </head>";
        }

        public static string CreateConfirmNewEmailBody(string token, PersonDom person)
        {
            return $@"
            <!DOCTYPE html>
            <html lang='nl'>
            {CreateBodyHead("Bevestig uw nieuwe e-mailadres")}
            <body>
                <div class='container'>
                    <div class='header'>
                        <img src='https://wnhnvxvcynrkidmptsga.supabase.co/storage/v1/object/public/templates/evergemsejoggings.jpg' alt='Evergemse Joggings'>
                    </div>
                    <div class='content'>
                        <h2>Evergemse Joggings</h2>
                        <h3>Bevestig uw nieuwe e-mailadres</h3>
                        <p>Beste {person.FirstName + " " + person.LastName},</p>
                        <p>Volg deze link om jouw nieuwe e-mailadres te bevestigen:</p>
                        <p><a class='button' href='http://20.56.159.69:50545/auth/confirm?token={token}'>Bevestig uw e-mail</a></p>
                    </div>
                    <div class='footer'>
                        <p>in samenwerking met</p>
                        <img src='https://wnhnvxvcynrkidmptsga.supabase.co/storage/v1/object/public/templates/logo-goud.png' alt='Logo Goud'>
                    </div>
                </div>
            </body>
            </html>";
        }

        public static string CreateConfirmBody(string token, PersonDom person)
        {
            return $@"
            <!DOCTYPE html>
            <html lang='nl'>
            {CreateBodyHead("Bevestig uw registratie")}
            <body>
                <div class='container'>
                    <div class='header'>
                        <img src='https://wnhnvxvcynrkidmptsga.supabase.co/storage/v1/object/public/templates/evergemsejoggings.jpg' alt='Evergemse Joggings'>
                    </div>
                    <div class='content'>
                        <h2>Evergemse Joggings</h2>
                        <h3>Bevestig uw registratie</h3>
                        <p>Beste {person.FirstName + ' ' + person.LastName},</p>
                        <p>Volg deze link om jouw profiel te activeren:</p>
                        <p><a class='button' href='http://20.56.159.69:50545/auth/confirm?token={token}'>Bevestig uw e-mail</a></p>
                    </div>
                    <div class='footer'>
                        <p>in samenwerking met</p>
                        <img src='https://wnhnvxvcynrkidmptsga.supabase.co/storage/v1/object/public/templates/logo-goud.png' alt='Logo Goud'>
                    </div>
                </div>
            </body>
            </html>";
        }

        public static string CreateRegistrationInfoBody(string token, string userName, string? competitionName)
        {
            string competitionText = string.IsNullOrWhiteSpace(competitionName)
                ? "Bedankt voor je inschrijving op de website."
                : $"Bedankt voor je inschrijving voor de {competitionName} jogging.";

            return $@"
            <!DOCTYPE html>
            <html lang='nl'>
            {CreateBodyHead("Bevestig uw registratie")}
            <body>
                <div class='container'>
                    <div class='header'>
                        <img src='https://wnhnvxvcynrkidmptsga.supabase.co/storage/v1/object/public/templates/evergemsejoggings.jpg' alt='Evergemse Joggings'>
                    </div>
                    <div class='content'>
                        <h2>Evergemse Joggings</h2>
                        <h3>Wachtwoord Instellen</h3>
                        <p>Beste {userName},</p>
                        <p>{competitionText}</p>
                        <p>Om deel te kunnen nemen aan het criterium (<a href='https://criterium.evergemsejoggings.be'>criterium.evergemsejoggings.be</a>) en toegang te krijgen tot je account moet je eerst een wachtwoord instellen. Volg de onderstaande stappen om je wachtwoord in te stellen:</p>
                        <p>Klik op deze link om naar de pagina voor wachtwoordinstelling te gaan: <a class='button' href='http://20.56.159.69:50545/auth/reset-wachtwoord?token={token}'>Wachtwoord Instellen Link</a></p>
                        <p>Kies een sterk wachtwoord.</p>
                        <p>Klik op 'Reset Wachtwoord' om het proces te voltooien.</p>
                        <p>Als je hulp nodig hebt of problemen ondervindt bij het instellen van je wachtwoord, neem dan contact op met de sympathieke lopers van de Kozirunners via <a href='mailto:info@kozirunners.be'>koziRunners</a>.</p>
                        <p>Alvast veel loopplezier en tot snel!</p>
                    </div>
                    <div class='footer'>
                        <p>in samenwerking met</p>
                        <img src='https://wnhnvxvcynrkidmptsga.supabase.co/storage/v1/object/public/templates/logo-goud.png' alt='Logo Goud'>
                    </div>
                </div>
            </body>
            </html>";
        }


        public static string CreatePasswordResetBody(string token)
        {
            return $@"
                    <!DOCTYPE html>
                    <html lang='nl'>
                    {CreateBodyHead("Wachtwoord Resetten")}
                    <body>
                        <div class='container'>
                            <div class='header'>
                                <img src='https://wnhnvxvcynrkidmptsga.supabase.co/storage/v1/object/public/templates/evergemsejoggings.jpg' alt='Evergemse Joggings'>
                            </div>
                            <div class='content'>
                                <h2>Evergemse Joggings</h2>
                                <h3>Wachtwoord Resetten</h3>
                                <p>Volg deze link om het wachtwoord voor uw account te resetten:</p>
                                <p><a class='button' href='http://20.56.159.69:50545/auth/reset-wachtwoord?token={token}'>Wachtwoord Resetten</a></p>
                            </div>
                            <div class='footer'>
                                <p>in samenwerking met</p>
                                <img src='https://wnhnvxvcynrkidmptsga.supabase.co/storage/v1/object/public/templates/logo-goud.png' alt='Logo Goud'>
                            </div>
                        </div>
                    </body>
                    </html>";
        }

        public static string CreatePersonChangedInfoBody(PersonDom originalPerson, PersonDom updatedPerson)
        {
            var genderChangeInfo = originalPerson.Gender != updatedPerson.Gender
                ? $"<p>{originalPerson.FirstName} {originalPerson.LastName} heeft zijn geslacht gewijzigd van {originalPerson.Gender} naar {updatedPerson.Gender}.</p>"
                : "";

            var birthDateChangeInfo = originalPerson.BirthDate != updatedPerson.BirthDate
                ? $"<p>{originalPerson.FirstName} {originalPerson.LastName} heeft zijn geboortedatum gewijzigd van {originalPerson.BirthDate.ToShortDateString()} naar {updatedPerson.BirthDate.ToShortDateString()}.</p>"
                : "";

            return $@"
        <!DOCTYPE html>
        <html lang='nl'>
        {CreateBodyHead("Informatie Wijziging Persoon")}
        <body>
            <div class='container'>
                <div class='header'>
                    <img src='https://wnhnvxvcynrkidmptsga.supabase.co/storage/v1/object/public/templates/evergemsejoggings.jpg' alt='Evergemse Joggings'>
                </div>
                <div class='content'>
                    <h2>Evergemse Joggings</h2>
                    <h3>Informatie Wijziging Persoon</h3>
                    {genderChangeInfo}
                    {birthDateChangeInfo}
                </div>
                <div class='footer'>
                    <p>in samenwerking met</p>
                    <img src='https://wnhnvxvcynrkidmptsga.supabase.co/storage/v1/object/public/templates/logo-goud.png' alt='Logo Goud'>
                </div>
            </div>
        </body>
        </html>";
        }
    }
}
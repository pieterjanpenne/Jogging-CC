using System.Text.RegularExpressions;
using Jogging.Domain.Models;

namespace Jogging.Domain.Helpers;

public class GetResultsFromFile
{
    private static readonly Regex CsvLineRegex = new Regex(@"^\d{2}:\d{2}:\d{2}\.\d{7};\d{4}$", RegexOptions.Compiled);

    public static async Task<Dictionary<int, ResultDom>> GetUpdatedRegistrations(ResultDom resultRequestDom,
        List<ResultDom> resultsDom)
    {
        var updatedRegistrations = new Dictionary<int, ResultDom>();

        await using var stream = resultRequestDom.FormFile.OpenReadStream();
        using var reader = new StreamReader(stream);
        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync();

            if (!string.IsNullOrEmpty(line) && CsvLineRegex.IsMatch(line))
            {
                var values = line.Split(';');
                if (TimeSpan.TryParse(values[0], out TimeSpan runTime) &&
                    int.TryParse(values[1], out int runNumber))
                {
                    var runNumberResult = resultsDom.FirstOrDefault(r => r.RunNumber == runNumber);
                    var currentRunTime = runNumberResult?.RunTime;
                    if (runNumberResult != null && (currentRunTime == null || runTime < currentRunTime))
                    {
                        var registration = runNumberResult;

                        if (updatedRegistrations.TryGetValue(registration.Id, out var existingRegistration))
                        {
                            if (runTime < existingRegistration.RunTime)
                            {
                                existingRegistration.RunTime = runTime;
                            }
                        }
                        else
                        {
                            registration.RunTime = runTime;
                            updatedRegistrations[registration.Id] = registration;
                        }
                    }
                }
            }
        }

        return updatedRegistrations;
    }
}
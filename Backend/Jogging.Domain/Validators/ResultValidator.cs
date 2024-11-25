using Jogging.Domain.Exceptions;
using Jogging.Domain.Models;
using Microsoft.AspNetCore.Http;

namespace Jogging.Domain.Validators;

public class ResultValidator
{
    public static void ValidateResultFile(IFormFile? formFile)
    {
        if (formFile == null || formFile.Length == 0)
        {
            throw new ResultException("The file can't be empty");
        }

        if (!Path.GetExtension(formFile.FileName).Equals(".csv", StringComparison.OrdinalIgnoreCase) && !Path.GetExtension(formFile.FileName).Equals(".txt", StringComparison.OrdinalIgnoreCase))
        {
            throw new ResultException("Only CSV and TXT files are supported");
        }
    }

    public static void ValidateUpdatedRegistrations(Dictionary<int, ResultDom> updatedRegistrations)
    {
        if (updatedRegistrations.Values.Count == 0)
        {
            throw new ResultException("No runtimes could be updated from the given file");
        }
    }
}
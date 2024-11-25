using Jogging.Domain.Helpers;
using Jogging.Domain.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Jogging.Rest.Utils;

public class ControllerUtil
{
    public static void AddPagination<T>(PagedList<T> pagedList, HttpResponse response)
    {
        var metadata = new
        {
            pagedList.TotalCount,
            pagedList.PageSize,
            pagedList.CurrentPage,
            pagedList.TotalPages,
            pagedList.HasNext,
            pagedList.HasPrevious
        };

        response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));
    }
}
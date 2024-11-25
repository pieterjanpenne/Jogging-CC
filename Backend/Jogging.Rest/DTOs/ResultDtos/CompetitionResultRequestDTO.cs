using Microsoft.AspNetCore.Http;

namespace Jogging.Rest.DTOs.ResultDtos;

public class CompetitionResultRequestDTO
{
    public IFormFile FormFile { get; set; }
}
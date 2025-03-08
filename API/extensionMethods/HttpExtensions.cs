using System.Text.Json;
using API.RequestHelpers;

namespace API.extensionMethods
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, MetaData metadata)
        {
            var options = new JsonSerializerOptions{PropertyNamingPolicy=JsonNamingPolicy.CamelCase};
            response.Headers["Pagination"] = JsonSerializer.Serialize(metadata, options);
            response.Headers["Access-Control-Expose-Headers"] = "Pagination";
        }
    }
}
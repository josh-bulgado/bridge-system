using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        foreach (var parameter in operation.Parameters)
        {
            // Check if the parameter is an IFormFile (file upload)
            if (parameter.In == ParameterLocation.Query && parameter.Schema.Type == "file")
            {
                parameter.Schema.Type = "string";
                parameter.Schema.Format = "binary";
            }
        }
    }
}

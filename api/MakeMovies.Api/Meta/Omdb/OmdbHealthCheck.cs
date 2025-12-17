using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace MakeMovies.Api.Meta.Omdb;

public class OmdbHealthCheck(OmdbClient client) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new())
    {
        try
        {
            var movie = await client.GetByImdbCodeAsync("tt0816692", cancellationToken);
            return movie is null
                ? HealthCheckResult.Unhealthy("no movie found")
                : HealthCheckResult.Healthy();
        }
        catch (Exception e)
        {
            return HealthCheckResult.Unhealthy(exception: e);
        }
    }
}
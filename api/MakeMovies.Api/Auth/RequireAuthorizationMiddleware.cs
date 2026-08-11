using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;

namespace MakeMovies.Api.Auth;

/// <summary>
/// Applies the default authorization policy to middleware that has no endpoint, e.g. static files.
/// Must be registered after UseAuthentication so that the user principal is populated.
/// </summary>
public class RequireAuthorizationMiddleware(
    RequestDelegate next,
    IAuthorizationPolicyProvider policyProvider,
    IAuthorizationService authorizationService)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var policy = await policyProvider.GetDefaultPolicyAsync();
        var result = await authorizationService.AuthorizeAsync(context.User, policy);

        if (result.Succeeded)
        {
            await next(context);
            return;
        }

        if (context.User.Identity?.IsAuthenticated == true)
        {
            await context.ForbidAsync();
        }
        else
        {
            await context.ChallengeAsync();
        }
    }
}

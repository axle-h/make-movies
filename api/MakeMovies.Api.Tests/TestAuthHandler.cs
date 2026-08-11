using System.Security.Claims;
using System.Text.Encodings.Web;
using MakeMovies.Api.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace MakeMovies.Api.Tests;

/// <summary>
/// Always authenticates a principal holding the app role, unless the request opts out with the
/// <see cref="AnonymousHeader"/> header.
/// </summary>
public class TestAuthHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    public const string SchemeName = "Test";

    public const string AnonymousHeader = "X-Test-Anonymous";

    public const string GivenName = "Test";

    public const string FamilyName = "User";

    public const string Email = "test@ax-h.com";

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (Request.Headers.ContainsKey(AnonymousHeader))
        {
            // NoResult rather than Fail, so that the authorization middleware issues a clean challenge.
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        Claim[] claims =
        [
            new("sub", "test-user"),
            new("name", $"{GivenName} {FamilyName}"),
            new("given_name", GivenName),
            new("family_name", FamilyName),
            new("email", Email),
            new("role", AuthOptions.DefaultRole)
        ];

        // The nameType and roleType arguments are what make RequireRole and IsInRole work.
        var identity = new ClaimsIdentity(claims, SchemeName, "name", "role");
        var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), SchemeName);
        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace MakeMovies.Api.Auth;

/// <summary>
/// Authenticates every request as a fake user. Registered only when Auth:Disabled is set, which
/// <see cref="AuthExtensions.AddMakeMoviesAuth"/> refuses to honour outside of Development.
/// </summary>
public class DevelopmentAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    IOptions<AuthOptions> authOptions,
    ILoggerFactory logger,
    UrlEncoder encoder)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    public const string SchemeName = "Development";

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        Claim[] claims =
        [
            new("sub", "dev"),
            new("name", "Dev User"),
            new("given_name", "Dev"),
            new("family_name", "User"),
            new("email", "dev@localhost"),
            new("role", authOptions.Value.Role)
        ];

        var identity = new ClaimsIdentity(claims, SchemeName, "name", "role");
        var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), SchemeName);
        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

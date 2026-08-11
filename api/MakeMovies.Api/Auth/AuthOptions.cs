namespace MakeMovies.Api.Auth;

public class AuthOptions
{
    public const string SectionName = "Auth";

    public const string DefaultRole = "make-movies";

    /// <summary>
    /// Disables authentication, authenticating every request as a fake user.
    /// Honoured in the Development environment only, startup fails anywhere else.
    /// </summary>
    public bool Disabled { get; set; }

    /// <summary>
    /// The OpenID Connect issuer e.g. https://sso.ax-h.com/
    /// </summary>
    public Uri? Authority { get; set; }

    public string? ClientId { get; set; }

    public string? ClientSecret { get; set; }

    /// <summary>
    /// The role claim value that a user must hold to use the app.
    /// </summary>
    public string Role { get; set; } = DefaultRole;

    public IList<string> Scopes { get; set; } = ["openid", "profile", "email", "roles"];

    /// <summary>
    /// Only disable this against a local identity provider served over http.
    /// </summary>
    public bool RequireHttpsMetadata { get; set; } = true;

    public TimeSpan SessionLifetime { get; set; } = TimeSpan.FromDays(30);
}

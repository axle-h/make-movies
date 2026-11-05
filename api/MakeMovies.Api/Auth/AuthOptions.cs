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
    /// Where to send the browser at sign out when the provider advertises no end_session_endpoint,
    /// e.g. Authelia. Called with the signed out page as rd. Defaults to {Authority}logout.
    /// </summary>
    public Uri? LogoutUrl { get; set; }

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

    public Uri GetLogoutUrl()
    {
        if (LogoutUrl is not null)
        {
            return LogoutUrl;
        }

        // Without the trailing slash a relative uri replaces the last path segment.
        var authority = Authority!.AbsoluteUri;
        return new Uri(new Uri(authority.EndsWith('/') ? authority : authority + "/"), "logout");
    }

    internal static bool IsValidLogoutUrl(Uri? uri) =>
        uri is null || (uri.IsAbsoluteUri && (uri.Scheme == Uri.UriSchemeHttps || uri.Scheme == Uri.UriSchemeHttp));
}

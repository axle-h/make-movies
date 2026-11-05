using System.Net;
using System.Security.Claims;
using MakeMovies.Api.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using WireMock.RequestBuilders;
using WireMock.ResponseBuilders;

namespace MakeMovies.Api.Tests.Auth;

/// <summary>
/// Sign out through the real cookie and oidc handlers. Each test gets its own host, because the
/// oidc handler caches the discovery document for the lifetime of the host.
/// </summary>
public class LogoutTests
{
    private static readonly Uri PublicUrl = new("https://movies.ax-h.com/");

    [Fact]
    public async Task Logging_out_against_a_provider_without_an_end_session_endpoint()
    {
        await using var fixture = new OidcApiFixture(endSessionEndpoint: false);

        var response = await fixture.LogoutAsync();

        response.StatusCode.Should().Be(HttpStatusCode.Redirect);
        var location = response.Headers.Location!;
        location.GetLeftPart(UriPartial.Path).Should().Be($"{fixture.Authority}logout");
        QueryHelpers.ParseQuery(location.Query).Should().ContainSingle()
            .Which.Should().BeEquivalentTo(
                new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>(
                    "rd", new Uri(PublicUrl, "logged-out.html").ToString()));

        ShouldClearSessionCookie(response);
    }

    [Fact]
    public async Task Logging_out_with_a_configured_logout_url()
    {
        await using var fixture = new OidcApiFixture(endSessionEndpoint: false, new Dictionary<string, string?>
        {
            ["Auth:LogoutUrl"] = "https://login.ax-h.com/sign-out?theme=dark"
        });

        var response = await fixture.LogoutAsync();

        response.StatusCode.Should().Be(HttpStatusCode.Redirect);
        var location = response.Headers.Location!;
        location.GetLeftPart(UriPartial.Path).Should().Be("https://login.ax-h.com/sign-out");

        var query = QueryHelpers.ParseQuery(location.Query);
        query["theme"].ToString().Should().Be("dark");
        query["rd"].ToString().Should().Be(new Uri(PublicUrl, "logged-out.html").ToString());

        ShouldClearSessionCookie(response);
    }

    [Fact]
    public async Task Logging_out_against_a_provider_with_an_end_session_endpoint()
    {
        // A standard provider still gets rp-initiated logout, Auth:LogoutUrl is ignored.
        await using var fixture = new OidcApiFixture(endSessionEndpoint: true);

        var response = await fixture.LogoutAsync();

        response.StatusCode.Should().Be(HttpStatusCode.Redirect);
        var location = response.Headers.Location!;
        location.GetLeftPart(UriPartial.Path).Should().Be($"{fixture.Authority}connect/endsession");

        var query = QueryHelpers.ParseQuery(location.Query);
        query["post_logout_redirect_uri"].ToString().Should().Be(new Uri(PublicUrl, "signout-callback-oidc").ToString());
        query.Should().ContainKey("state");
        
        ShouldClearSessionCookie(response);
    }

    [Fact]
    public async Task Logging_out_anonymously()
    {
        await using var fixture = new OidcApiFixture(endSessionEndpoint: false);

        var response = await fixture.CreateClient(fixture.BrowserOptions)
            .GetAsync("/auth/logout", TestContext.Current.CancellationToken);

        response.StatusCode.Should().Be(HttpStatusCode.Redirect);
        response.Headers.Location!.ToString().Should().Be("/");
    }

    [Theory]
    [InlineData("logout")]
    [InlineData("ftp://sso.ax-h.com/logout")]
    public async Task Starting_with_an_invalid_logout_url(string logoutUrl)
    {
        await using var fixture = new OidcApiFixture(endSessionEndpoint: false, new Dictionary<string, string?>
        {
            ["Auth:LogoutUrl"] = logoutUrl
        });

        var start = () => fixture.CreateClient();

        start.Should().Throw<OptionsValidationException>()
            .Which.Message.Should().Contain("Auth:LogoutUrl");
    }

    private static void ShouldClearSessionCookie(HttpResponseMessage response)
    {
        response.Headers.TryGetValues("Set-Cookie", out var cookies).Should().BeTrue();
        cookies.Should().Contain(c =>
            c.StartsWith("make-movies=;") && c.Contains("expires=Thu, 01 Jan 1970 00:00:00 GMT"));
    }

    private sealed class OidcApiFixture : ApiFixture
    {
        private readonly IDictionary<string, string?> _configuration;

        public OidcApiFixture(bool endSessionEndpoint, IDictionary<string, string?>? configuration = null)
        {
            Authority = new Uri($"{WireMock.Urls[0]}/sso/");
            _configuration = new Dictionary<string, string?>(configuration ?? new Dictionary<string, string?>())
            {
                ["Auth:Authority"] = Authority.ToString(),
                ["Auth:RequireHttpsMetadata"] = "false"
            };

            var discovery = new Dictionary<string, object>
            {
                ["issuer"] = Authority.ToString().TrimEnd('/'),
                ["authorization_endpoint"] = $"{Authority}api/oidc/authorization",
                ["token_endpoint"] = $"{Authority}api/oidc/token",
                ["userinfo_endpoint"] = $"{Authority}api/oidc/userinfo",
                ["jwks_uri"] = $"{Authority}jwks.json",
                ["response_types_supported"] = new[] {"code"},
                ["subject_types_supported"] = new[] {"public"},
                ["id_token_signing_alg_values_supported"] = new[] {"RS256"}
            };
            if (endSessionEndpoint)
            {
                discovery["end_session_endpoint"] = $"{Authority}connect/endsession";
            }

            WireMock.Given(Request.Create().WithPath("/sso/.well-known/openid-configuration").UsingGet())
                .RespondWith(Response.Create().WithBodyAsJson(discovery));
            WireMock.Given(Request.Create().WithPath("/sso/jwks.json").UsingGet())
                .RespondWith(Response.Create().WithBodyAsJson(new {keys = Array.Empty<object>()}));
        }

        public Uri Authority { get; }

        public WebApplicationFactoryClientOptions BrowserOptions { get; } = new()
        {
            AllowAutoRedirect = false,
            HandleCookies = false,
            BaseAddress = PublicUrl
        };

        protected override bool UseTestAuth => false;

        protected override IDictionary<string, string?> Configuration => _configuration;

        /// <summary>
        /// Signs out with a session cookie minted by the app's own cookie handler, as if the user
        /// had just completed a login.
        /// </summary>
        public async Task<HttpResponseMessage> LogoutAsync()
        {
            var client = CreateClient(BrowserOptions);

            var cookieOptions = Services.GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>()
                .Get(CookieAuthenticationDefaults.AuthenticationScheme);
            var identity = new ClaimsIdentity(
                [new Claim("sub", "test-user"), new Claim("name", "Test User"), new Claim("role", AuthOptions.DefaultRole)],
                CookieAuthenticationDefaults.AuthenticationScheme, "name", "role");
            var ticket = new AuthenticationTicket(
                new ClaimsPrincipal(identity),
                new AuthenticationProperties {IsPersistent = true},
                CookieAuthenticationDefaults.AuthenticationScheme);

            var request = new HttpRequestMessage(HttpMethod.Get, "/auth/logout");
            request.Headers.Add("Cookie", $"{cookieOptions.Cookie.Name}={cookieOptions.TicketDataFormat.Protect(ticket)}");

            return await client.SendAsync(request, TestContext.Current.CancellationToken);
        }
    }
}

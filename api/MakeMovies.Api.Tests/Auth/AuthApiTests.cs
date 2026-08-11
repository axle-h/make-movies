using System.Net;
using System.Net.Http.Json;
using MakeMovies.Api.Auth;
using Microsoft.AspNetCore.Mvc.Testing;

namespace MakeMovies.Api.Tests.Auth;

public class AuthApiTests(ApiFixture fixture) : ApiTests(fixture)
{
    [Fact]
    public async Task Getting_current_user()
    {
        var response = await Fixture.CreateClient()
            .GetAsync("/api/v1/me", TestContext.Current.CancellationToken);
        response.EnsureSuccessStatusCode();

        var user = await response.Content.ReadFromJsonAsync<UserInfo>(TestContext.Current.CancellationToken);

        user.Should().NotBeNull();
        user.GivenName.Should().Be(TestAuthHandler.GivenName);
        user.FamilyName.Should().Be(TestAuthHandler.FamilyName);
        user.Email.Should().Be(TestAuthHandler.Email);
        user.Name.Should().Be($"{TestAuthHandler.GivenName} {TestAuthHandler.FamilyName}");

        // The whole point of JsonArrayClaimAction: one claim per role, not a single json blob.
        user.Roles.Should().BeEquivalentTo([AuthOptions.DefaultRole]);
    }

    [Theory]
    [InlineData("/api/v1/me")]
    [InlineData("/api/v1/movie")]
    [InlineData("/api/v1/genre")]
    [InlineData("/api/v1/download")]
    [InlineData("/movie-images/tt0816692.jpg")]
    public async Task Calling_api_anonymously(string path)
    {
        var response = await AnonymousClient()
            .GetAsync(path, TestContext.Current.CancellationToken);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Theory]
    [InlineData("/")]
    [InlineData("/movies")]
    [InlineData("/movies/yts_1632")]
    [InlineData("/downloads")]
    [InlineData("/scraper")]
    public async Task Getting_spa_route_anonymously(string path)
    {
        // The shell is the authorization gate, so an unauthenticated navigation is rejected
        // before the file is ever looked up.
        var response = await AnonymousClient()
            .GetAsync(path, TestContext.Current.CancellationToken);
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Theory]
    [InlineData("/health/live")]
    [InlineData("/health/ready")]
    public async Task Getting_probe_anonymously(string path)
    {
        var response = await AnonymousClient()
            .GetAsync(path, TestContext.Current.CancellationToken);
        response.StatusCode.Should().NotBe(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Getting_unknown_api_route()
    {
        // The spa fallback must not answer an unmatched api route with the shell and a 200.
        var response = await Fixture.CreateClient()
            .GetAsync("/api/v1/not-a-real-route", TestContext.Current.CancellationToken);
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    private HttpClient AnonymousClient()
    {
        var client = Fixture.CreateClient(new WebApplicationFactoryClientOptions {AllowAutoRedirect = false});
        client.DefaultRequestHeaders.Add(TestAuthHandler.AnonymousHeader, "true");
        return client;
    }
}

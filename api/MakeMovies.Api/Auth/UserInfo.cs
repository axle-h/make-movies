using System.Security.Claims;

namespace MakeMovies.Api.Auth;

public record UserInfo
{
    public required string Name { get; init; }

    public string? GivenName { get; init; }

    public string? FamilyName { get; init; }

    public string? Email { get; init; }

    public required IReadOnlyList<string> Roles { get; init; }

    public static UserInfo FromPrincipal(ClaimsPrincipal principal)
    {
        var givenName = principal.FindFirstValue("given_name");
        var familyName = principal.FindFirstValue("family_name");

        var name = principal.FindFirstValue("name")
                   ?? Join(givenName, familyName)
                   ?? principal.FindFirstValue("preferred_username")
                   ?? principal.FindFirstValue("email")
                   ?? "Unknown";

        return new UserInfo
        {
            Name = name,
            GivenName = givenName,
            FamilyName = familyName,
            Email = principal.FindFirstValue("email"),
            Roles = principal.FindAll("role").Select(c => c.Value).ToArray()
        };
    }

    private static string? Join(string? givenName, string? familyName)
    {
        var name = string.Join(' ', new[] {givenName, familyName}.Where(x => !string.IsNullOrWhiteSpace(x)));
        return string.IsNullOrWhiteSpace(name) ? null : name;
    }
}

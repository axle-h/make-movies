using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.OAuth.Claims;

namespace MakeMovies.Api.Auth;

/// <summary>
/// Maps a userinfo property that may be either a string or an array of strings into one claim per value.
/// The built in <see cref="ClaimActionCollectionMapExtensions.MapJsonKey(ClaimActionCollection,string,string)"/>
/// stringifies an array into a single claim holding raw json e.g. ["make-movies"], which silently fails
/// every role check.
/// </summary>
public sealed class JsonArrayClaimAction(string claimType, string jsonKey)
    : ClaimAction(claimType, ClaimValueTypes.String)
{
    public override void Run(JsonElement userData, ClaimsIdentity identity, string issuer)
    {
        if (userData.ValueKind != JsonValueKind.Object || !userData.TryGetProperty(jsonKey, out var value))
        {
            return;
        }

        switch (value.ValueKind)
        {
            case JsonValueKind.String:
                AddClaim(value.GetString(), identity, issuer);
                break;

            case JsonValueKind.Array:
                foreach (var element in value.EnumerateArray())
                {
                    if (element.ValueKind == JsonValueKind.String)
                    {
                        AddClaim(element.GetString(), identity, issuer);
                    }
                }
                break;
        }
    }

    private void AddClaim(string? value, ClaimsIdentity identity, string issuer)
    {
        if (string.IsNullOrEmpty(value) || identity.HasClaim(ClaimType, value))
        {
            return;
        }
        identity.AddClaim(new Claim(ClaimType, value, ValueType, issuer));
    }
}

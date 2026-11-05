using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MakeMovies.Api.Auth;

/// <summary>
/// Deliberately not under /api so that the 401-instead-of-redirect rule for xhr can be a flat
/// path check without an exception for the endpoint that has to be allowed to redirect.
/// </summary>
[ApiController]
[Route("auth")]
[AllowAnonymous]
[ApiExplorerSettings(IgnoreApi = true)]
public class AuthController : ControllerBase
{
    /// <summary>
    /// Starts an OpenID Connect sign in, returning to a local url.
    /// </summary>
    [HttpGet("login")]
    public IActionResult Login([FromQuery] string? returnUrl = null)
    {
        var target = Url.IsLocalUrl(returnUrl) ? returnUrl! : "/";

        if (User.Identity?.IsAuthenticated == true)
        {
            return LocalRedirect(target);
        }

        return Challenge(
            new AuthenticationProperties {RedirectUri = target, IsPersistent = true},
            OpenIdConnectDefaults.AuthenticationScheme);
    }

    /// <summary>
    /// Signs out locally and at the identity provider.
    /// </summary>
    [HttpGet("logout")]
    public IActionResult Logout()
    {
        if (User.Identity?.IsAuthenticated != true)
        {
            return LocalRedirect("/");
        }

        // No properties: a redirect uri here would bypass SignedOutRedirectUri. The cookie scheme
        // goes first so the local session is cleared whichever way the oidc scheme then leaves:
        // rp-initiated logout at the end session endpoint, or Auth:LogoutUrl if there is none.
        return SignOut(
            CookieAuthenticationDefaults.AuthenticationScheme,
            OpenIdConnectDefaults.AuthenticationScheme);
    }
}

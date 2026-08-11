using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

namespace MakeMovies.Api.Auth;

public static class AuthExtensions
{
    public static WebApplicationBuilder AddMakeMoviesAuth(this WebApplicationBuilder builder)
    {
        builder.Services.AddOptions<AuthOptions>()
            .BindConfiguration(AuthOptions.SectionName)
            .Validate(o => o.Disabled || o.Authority is not null, "Auth:Authority is required")
            .Validate(o => o.Disabled || !string.IsNullOrWhiteSpace(o.ClientId), "Auth:ClientId is required")
            .Validate(o => o.Disabled || !string.IsNullOrWhiteSpace(o.ClientSecret), "Auth:ClientSecret is required")
            .ValidateOnStart();

        // Tls is terminated at the ingress. Without this the redirect uri is built from the scheme we
        // see rather than the one the browser used, so it goes out as http:// and the idp rejects it.
        builder.Services.Configure<ForwardedHeadersOptions>(o =>
        {
            o.ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
            o.KnownIPNetworks.Clear();
            o.KnownProxies.Clear();
        });

        builder.Services.AddAuthorization();
        builder.Services.AddOptions<AuthorizationOptions>()
            .Configure<IOptions<AuthOptions>>((options, auth) =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .RequireRole(auth.Value.Role)
                    .Build();

                options.DefaultPolicy = policy; // a bare [Authorize]
                options.FallbackPolicy = policy; // everything that does not opt out
            });

        // The only setting that has to be read eagerly, because it decides which schemes exist.
        // Configuration added later by a test host is therefore invisible to it, which is what we
        // want: the bypass can only ever be turned on by appsettings or the environment.
        if (builder.Configuration.GetValue($"{AuthOptions.SectionName}:{nameof(AuthOptions.Disabled)}", false))
        {
            AddDisabledAuth(builder);
            return builder;
        }

        AddDataProtection(builder);

        builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
                options.DefaultForbidScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, _ => { });

        // Configured out of band rather than inline above so that AuthOptions is resolved lazily.
        // A test host adds its configuration after this method has already run.
        builder.Services.AddOptions<CookieAuthenticationOptions>(CookieAuthenticationDefaults.AuthenticationScheme)
            .Configure<IOptions<AuthOptions>, IWebHostEnvironment>(
                (options, auth, environment) => ConfigureCookie(options, environment, auth.Value));

        builder.Services.AddOptions<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme)
            .Configure<IOptions<AuthOptions>>((options, auth) => ConfigureOpenIdConnect(options, auth.Value));

        return builder;
    }

    /// <summary>
    /// The auth cookie is encrypted with the data protection key ring. Persist it alongside the db,
    /// otherwise the keys are ephemeral and every restart silently signs everybody out.
    /// </summary>
    private static void AddDataProtection(WebApplicationBuilder builder)
    {
        builder.Services.AddDataProtection().SetApplicationName("make-movies");

        builder.Services.AddOptions<KeyManagementOptions>()
            .Configure<IOptions<DbOptions>, ILoggerFactory>((options, db, loggerFactory) =>
            {
                var keyPath = new DirectoryInfo(Path.Join(db.Value.Path ?? "data", "keys"));
                keyPath.Create();
                options.XmlRepository = new FileSystemXmlRepository(keyPath, loggerFactory);
            });
    }

    private static void AddDisabledAuth(WebApplicationBuilder builder)
    {
        if (!builder.Environment.IsDevelopment())
        {
            throw new InvalidOperationException(
                "Auth:Disabled is only supported in the Development environment, " +
                $"the current environment is '{builder.Environment.EnvironmentName}'.");
        }

        builder.Services
            .AddAuthentication(DevelopmentAuthenticationHandler.SchemeName)
            .AddScheme<AuthenticationSchemeOptions, DevelopmentAuthenticationHandler>(
                DevelopmentAuthenticationHandler.SchemeName, _ => { });
    }

    private static void ConfigureCookie(
        CookieAuthenticationOptions options,
        IWebHostEnvironment environment,
        AuthOptions auth)
    {
        options.Cookie.Name = "make-movies";
        options.Cookie.HttpOnly = true;
        options.Cookie.IsEssential = true;

        // Setting this explicitly (rather than leaving it Unspecified) also opts out of Chrome's
        // "Lax + POST" two minute intervention. It is what makes antiforgery tokens unnecessary.
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = environment.IsDevelopment()
            ? CookieSecurePolicy.SameAsRequest
            : CookieSecurePolicy.Always;

        options.ExpireTimeSpan = auth.SessionLifetime;
        options.SlidingExpiration = true;
        options.AccessDeniedPath = "/access-denied.html";

        // Nothing challenges the cookie scheme in this app, the oidc scheme handles that. This is
        // belt and braces so that an xhr can never be handed a login redirect.
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };

        options.Events.OnRedirectToAccessDenied = context =>
        {
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            }

            context.Response.Redirect(context.RedirectUri);
            return Task.CompletedTask;
        };
    }

    private static void ConfigureOpenIdConnect(OpenIdConnectOptions options, AuthOptions auth)
    {
        options.Authority = auth.Authority!.ToString();
        options.ClientId = auth.ClientId;
        options.ClientSecret = auth.ClientSecret;
        options.RequireHttpsMetadata = auth.RequireHttpsMetadata;

        options.ResponseType = OpenIdConnectResponseType.Code;
        options.UsePkce = true;
        options.SaveTokens = true; // the id token is needed as id_token_hint at sign out
        options.UseTokenLifetime = false; // else the cookie inherits the id token lifetime
        options.GetClaimsFromUserInfoEndpoint = true;

        options.Scope.Clear();
        foreach (var scope in auth.Scopes)
        {
            options.Scope.Add(scope);
        }

        options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.SignedOutRedirectUri = "/logged-out.html";

        // Keep the wire claim names rather than the ws-fed uris.
        options.MapInboundClaims = false;
        options.TokenValidationParameters.NameClaimType = "name";
        options.TokenValidationParameters.RoleClaimType = "role";

        // Claim actions run against the userinfo response only, never the id token.
        options.ClaimActions.Add(new JsonArrayClaimAction("role", "role"));
        options.ClaimActions.MapUniqueJsonKey("name", "name");
        options.ClaimActions.MapUniqueJsonKey("given_name", "given_name");
        options.ClaimActions.MapUniqueJsonKey("family_name", "family_name");
        options.ClaimActions.MapUniqueJsonKey("email", "email");

        options.Events.OnRedirectToIdentityProvider = context =>
        {
            // An expired session on an xhr must not be answered with a login redirect.
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.HandleResponse();
            }
            return Task.CompletedTask;
        };

        options.Events.OnTicketReceived = context =>
        {
            var properties = context.Properties!;

            // Keep the cookie under 4kb, only the id token is ever used again.
            var idToken = properties.GetTokenValue(OpenIdConnectParameterNames.IdToken);
            properties.StoreTokens(idToken is null
                ? []
                : [new AuthenticationToken {Name = OpenIdConnectParameterNames.IdToken, Value = idToken}]);

            // The implicit challenge from the gated spa fallback carries no properties, so without
            // this we would issue a session cookie and force a login on every browser restart.
            properties.IsPersistent = true;
            properties.ExpiresUtc = null;

            return Task.CompletedTask;
        };
    }
}

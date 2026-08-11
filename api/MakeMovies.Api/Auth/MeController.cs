using Microsoft.AspNetCore.Mvc;

namespace MakeMovies.Api.Auth;

[ApiController]
[Route("api/v1/me")]
[Produces("application/json")]
public class MeController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public UserInfo GetCurrentUser() => UserInfo.FromPrincipal(User);
}

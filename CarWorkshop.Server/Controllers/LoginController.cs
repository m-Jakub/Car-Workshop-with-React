using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using CarWorkshop.Server.Models;
using CarWorkshop.Server.ViewModels;
using System.Security.Claims;

namespace CarWorkshop.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;

        public AuthController(SignInManager<AppUser> signInManager, UserManager<AppUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginVM model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, false);

                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync(model.Username);
                    if (user != null)
                    {
                        var roles = await _userManager.GetRolesAsync(user);
                        string userRole = roles.FirstOrDefault();
                        string userName = user.Name;

                        var claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.NameIdentifier, user.Id),
                            new Claim(ClaimTypes.Name, user.Name),
                            new Claim(ClaimTypes.Role, userRole)
                        };
                        await _signInManager.SignInWithClaimsAsync(user, model.RememberMe, claims);

                        return Ok(new { success = true, role = userRole, name = userName });
                    }

                    return BadRequest(new { error = "User not found" });
                }

                return BadRequest(new { error = "Invalid login attempt" });
            }

            return BadRequest(ModelState);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { success = true });
        }
    }
}

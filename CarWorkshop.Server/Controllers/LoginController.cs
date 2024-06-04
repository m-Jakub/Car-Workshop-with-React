using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using CarWorkshop.Server.Models;
using CarWorkshop.Server.ViewModels;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;

namespace CarWorkshop.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/auth")]
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

        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
        {
            if (User.Identity.IsAuthenticated)
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _userManager.FindByIdAsync(userId);
                var role = User.IsInRole("Admin") ? "Admin" : "Employee";
                var name = user.Name;
                return Ok(new { isAuthenticated = true, role, name });
            }
            return Ok(new { isAuthenticated = false });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
            return Ok(new { success = true });
        }
    }
}

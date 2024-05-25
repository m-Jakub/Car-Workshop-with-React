using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using CarWorkshop.Server.Models;
using System.Linq;
using System.Threading.Tasks;


namespace CarWorkshop.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeManagementController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;

        public EmployeeManagementController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetEmployees(int page = 1, int pageSize = 10)
        {
            var adminUsers = await _userManager.GetUsersInRoleAsync("Admin");
            var allUsers = _userManager.Users.ToList();
        
            var employees = allUsers.Except(adminUsers).ToList();
        
            var totalEmployees = employees.Count;
            var pagedEmployees = employees.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        
            var model = new EmployeeManagementVM
            {
                Employees = pagedEmployees,
                Page = page,
                PageSize = pageSize,
                TotalEmployees = totalEmployees
            };
        
            return Ok(model);
        }

        // [HttpPost]
        // public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeVM model)
        // {
        //     if (ModelState.IsValid)
        //     {
        //         var user = new AppUser { UserName = model.Username, Email = model.Email };
        //         var result = await _userManager.CreateAsync(user, model.Password);

        //         if (result.Succeeded)
        //         {
        //             return Ok(new { success = true });
        //         }
        //         return BadRequest(result.Errors);
        //     }
        //     return BadRequest(ModelState);
        // }

        // [HttpDelete("{id}")]
        // public async Task<IActionResult> DeleteEmployee(string id)
        // {
        //     var user = await _userManager.FindByIdAsync(id);
        //     if (user == null)
        //     {
        //         return NotFound();
        //     }

        //     var result = await _userManager.DeleteAsync(user);
        //     if (result.Succeeded)
        //     {
        //         return Ok(new { success = true });
        //     }
        //     return BadRequest(result.Errors);
        // }

        // [HttpPut("{id}")]
        // public async Task<IActionResult> UpdateEmployee(string id, [FromBody] UpdateEmployeeVM model)
        // {
        //     var user = await _userManager.FindByIdAsync(id);
        //     if (user == null)
        //     {
        //         return NotFound();
        //     }

        //     user.UserName = model.Username;
        //     user.Email = model.Email;

        //     var result = await _userManager.UpdateAsync(user);
        //     if (result.Succeeded)
        //     {
        //         return Ok(new { success = true });
        //     }
        //     return BadRequest(result.Errors);
        // }

    }
}

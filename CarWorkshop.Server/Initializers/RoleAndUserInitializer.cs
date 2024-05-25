using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CarWorkshop.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

public class RoleAndUserInitializer
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<AppUser> _userManager;
    private readonly ILogger<RoleAndUserInitializer> _logger;

    public RoleAndUserInitializer(RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager, ILogger<RoleAndUserInitializer> logger)
    {
        this._roleManager = roleManager;
        this._userManager = userManager;
        this._logger = logger;
    }

    public async Task InitializeRolesAndUsersAsync()
    {
        try
        {
            await EnsureRoleExistsAsync("Admin");
            await EnsureRoleExistsAsync("Employee");

            var adminUser = await EnsureUserExistsAsync("admin@example.com", "Admin123", "Admin");

            if (!await _userManager.IsInRoleAsync(adminUser, "Admin"))
            {
                await _userManager.AddToRoleAsync(adminUser, "Admin");
            }

            var otherUsers = await _userManager.Users.ToListAsync();
            foreach (var user in otherUsers)
            {
                if (user.UserName != "admin@example.com" && !await _userManager.IsInRoleAsync(user, "Employee"))
                {
                    await _userManager.AddToRoleAsync(user, "Employee");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initializing roles and users.");
            throw;
        }
    }

    private async Task EnsureRoleExistsAsync(string roleName)
    {
        if (!await _roleManager.RoleExistsAsync(roleName))
        {
            var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    _logger.LogError($"Error creating role {roleName}: {error.Code} - {error.Description}");
                }
                throw new Exception($"Failed to create role {roleName}");
            }
        }
    }

    private async Task<AppUser> EnsureUserExistsAsync(string email, string password, string name)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            user = new AppUser { Name = name, UserName = email, Email = email };
            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    _logger.LogError($"Error creating user {email}: {error.Code} - {error.Description}");
                }
                throw new Exception($"Failed to create user {email}");
            }
        }
        return user;
    }
}

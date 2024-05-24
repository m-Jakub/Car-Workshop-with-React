using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CarWorkshop.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

public class RoleAndUserInitializer
{
    private readonly RoleManager<IdentityRole> roleManager;
    private readonly UserManager<AppUser> userManager;
    private readonly ILogger<RoleAndUserInitializer> logger;

    public RoleAndUserInitializer(RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager, ILogger<RoleAndUserInitializer> logger)
    {
        this.roleManager = roleManager;
        this.userManager = userManager;
        this.logger = logger;
    }

    public async Task InitializeRolesAndUsersAsync()
    {
        try
        {
            await EnsureRoleExistsAsync("Admin");
            await EnsureRoleExistsAsync("Employee");

            var adminUser = await EnsureUserExistsAsync("admin@example.com", "Admin123", "Admin");

            if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }

            var otherUsers = await userManager.Users.ToListAsync();
            foreach (var user in otherUsers)
            {
                if (user.UserName != "admin@example.com" && !await userManager.IsInRoleAsync(user, "Employee"))
                {
                    await userManager.AddToRoleAsync(user, "Employee");
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while initializing roles and users.");
            throw;
        }
    }

    private async Task EnsureRoleExistsAsync(string roleName)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            var result = await roleManager.CreateAsync(new IdentityRole(roleName));
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    logger.LogError($"Error creating role {roleName}: {error.Code} - {error.Description}");
                }
                throw new Exception($"Failed to create role {roleName}");
            }
        }
    }

    private async Task<AppUser> EnsureUserExistsAsync(string email, string password, string name)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            user = new AppUser { Name = name, UserName = email, Email = email };
            var result = await userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    logger.LogError($"Error creating user {email}: {error.Code} - {error.Description}");
                }
                throw new Exception($"Failed to create user {email}");
            }
        }
        return user;
    }
}

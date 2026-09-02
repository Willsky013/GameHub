using GameHub.Server.Models;
using GameHub.Server.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace GameHub.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // Register
        // - Creates a new user with the given email and password
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                DisplayName = request.DisplayName
            };
            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new{message = "User registered successfully."});
        }


        // Login
        // - Signs in a user using email and password
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var result = await _signInManager.PasswordSignInAsync(
                request.Email,
                request.Password,
                false,
                false
            );

            if (!result.Succeeded)
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });

            return Ok(new
            {
                message = "Login successful."
            });
        }


        // Me
        // - Returns the currently authenticated user's basic profile
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                return Unauthorized();

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                displayName = user.DisplayName
            });
        }


        // Logout
        // - Signs out the current user
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            return Ok(new
            {
                message = "Logout successful."
            });
        }

        // UpdateProfile
        // - Updates the current user's profile and optionally changes password
        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(request.CurrentPassword))
            {
                return BadRequest(new
                {
                    message = "Current password is required."
                });
            }

            var passwordCheck = await _userManager.CheckPasswordAsync(
                user,
                request.CurrentPassword
            );

            if (!passwordCheck)
            {
                return BadRequest(new
                {
                    message = "Current password is incorrect."
                });
            }

            user.DisplayName = request.DisplayName;
            user.Email = request.Email;
            user.UserName = request.Email;

            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
            {
                return BadRequest(new
                {
                    message = string.Join(
                        " ",
                        updateResult.Errors.Select(e => e.Description)
                    )
                });
            }

            if (!string.IsNullOrWhiteSpace(request.NewPassword))
            {
                var passwordResult = await _userManager.ChangePasswordAsync(
                    user,
                    request.CurrentPassword,
                    request.NewPassword
                );

                if (!passwordResult.Succeeded)
                {
                    return BadRequest(new
                    {
                        message = string.Join(
                            " ",
                            passwordResult.Errors.Select(e => e.Description)
                        )
                    });
                }
            }

            return Ok(new
            {
                message = "Profile updated successfully.",
                displayName = user.DisplayName,
                email = user.Email
            });
        }
    }
}

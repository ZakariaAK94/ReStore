using API.Data;
using API.DTOs;
using API.Entities;
using API.extensionMethods;
using API.IServices;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;
        private readonly IUserService _userService;

        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context, IUserService userService)
        {
            _userService = userService;
            _tokenService = tokenService;
            _context = context;
            _userManager = userManager;

        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _userManager.FindByNameAsync(loginDTO.UserName);

            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDTO.Password))
            {
                return Unauthorized();
            }

            var userBasket = await GetBasket(loginDTO.UserName);
            var anonBaskt = await GetBasket(Request.Cookies["buyerId"]);

            if (anonBaskt != null)
            {
                if (userBasket != null) _context.Baskets.Remove(userBasket);
                Response.Cookies.Delete("buyerId");
                anonBaskt.BuyerId = user.UserName;
                await _context.SaveChangesAsync();
            }

            return new UserDTO
            {
                UserName = user.UserName,
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = anonBaskt != null ? anonBaskt.MapBasketToDTO() : userBasket?.MapBasketToDTO()
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDTO registerDTO)
        {
            var user = new User { UserName = registerDTO.UserName, Email = registerDTO.Email };

            var result = await _userManager.CreateAsync(user, registerDTO.Password);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");

            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var currentUserBasket = await GetBasket(User.Identity.Name);

            return new UserDTO
            {
                UserName = user.UserName,
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = currentUserBasket?.MapBasketToDTO()
            };
        }

        [Authorize]
        [HttpGet("savedAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress()
        {
            return await _userManager.Users
                         .Where(u => u.UserName == User.Identity.Name)
                         .Select(u => u.Address)
                         .FirstOrDefaultAsync();
        }
        private async Task<Basket> GetBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                              .Include(i => i.Items)
                              .ThenInclude(p => p.Product)
                              .FirstOrDefaultAsync(u => u.BuyerId == buyerId);
        }

        [Authorize]
        [HttpPut("editprofile")]
        public async Task<ActionResult> UpdateProfile(ProfileDTO dto)
        {
             var username = User.Identity.Name;
            var result = await _userService.UpdateProfileAsync(username, dto);
            if(!result.Success) return BadRequest(new ProblemDetails{Title=result.ErrorMessage});
            return Ok(new { message = "Profile updated successfully!" });
        }

        [Authorize]
        [HttpPut("change-password")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDTO dto)
        {
            var username = User.Identity.Name;
            var result = await _userService.ChangePasswordAsync(username, dto);
            if (!result.Success)
                return BadRequest(new ProblemDetails{Title=result.ErrorMessage});

            return Ok(new { message = "Password changed successfully!" });
        }

        [Authorize] 
        [HttpDelete("delete-account")]
        public async Task<IActionResult> DeleteAccount([FromBody]DeleteAccountDTO deleteAccount)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            if(user == null)
                return NotFound(new ProblemDetails{Title="User not found"});

            var roles = await _userManager.GetRolesAsync(user);

            if(roles.Contains("Admin"))
            {
                return Forbid("Admin is not allowed to delete his account.");
            }

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, deleteAccount.CurrentPassword);
            if (!isPasswordValid)
                return BadRequest(new ProblemDetails{Title="Invalid password."}); 
 
            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
                return BadRequest(new ProblemDetails{Title="Failed to delete account"});

            return Ok("Account deleted successfully");
        }


    }
}
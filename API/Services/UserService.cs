using API.Data;
using API.DTOs;
using API.Entities;
using API.IServices;
using API.RequestHelpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;

        public UserService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<OperationResult> UpdateProfileAsync(string userName, ProfileDTO dto)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null) return new OperationResult{Success=false, ErrorMessage="User not found."};

            var passwordValid = await _userManager.CheckPasswordAsync(user, dto.CurrentPassword);
            if (!passwordValid) return new OperationResult{Success=false, ErrorMessage="Current password is incorrect."};

            user.Email = dto.Email;
            user.UserName = dto.Username;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return new OperationResult { Success = false, ErrorMessage = "Failed to update user profile." };

            return new OperationResult { Success = true };
        }

        public async Task<OperationResult> ChangePasswordAsync(string username, ChangePasswordDTO dto)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
                return new OperationResult { Success = false, ErrorMessage = "User not found." };

            var passwordValid = await _userManager.CheckPasswordAsync(user, dto.OldPassword);
            if (!passwordValid)
                return new OperationResult { Success = false, ErrorMessage = "Old password is incorrect." };

            var result = await _userManager.ChangePasswordAsync(user, dto.OldPassword, dto.NewPassword);
            if (!result.Succeeded)
                return new OperationResult { Success = false, ErrorMessage = "Failed to change password." };

            return new OperationResult { Success = true };
        }
    }
}
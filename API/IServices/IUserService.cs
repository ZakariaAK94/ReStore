using API.DTOs;
using API.RequestHelpers;

namespace API.IServices
{
    public interface IUserService
    {   
        Task<OperationResult> UpdateProfileAsync(string username, ProfileDTO dto);
        Task<OperationResult> ChangePasswordAsync(string userName, ChangePasswordDTO dto);
         
    }
}
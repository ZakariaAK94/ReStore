using API.DTOs;
using Microsoft.AspNetCore.Identity;
using Npgsql.Replication;

namespace API.Entities
{
    public class User : IdentityUser<int>
    {
        public UserAddress Address { get; set; }
        
    }

}
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers
{
   public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CreateProductDTO,Product>();
        CreateMap<UpdateProductDTO,Product>();
    }
}
}
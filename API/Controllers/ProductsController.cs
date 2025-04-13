using API.Data;
using API.DTOs;
using API.Entities;
using API.extensionMethods;
using API.RequestHelpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;

        private readonly ImageService _imageService;

        public ProductsController(StoreContext context, IMapper mapper, ImageService imageService)
        {
            _imageService = imageService;
            _context = context;
            _mapper = mapper;
        }


        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
        {
            var query = _context.Products
                     .Sort(productParams.OrderBy)
                     .Search(productParams.SearchTerm)
                     .Filter(productParams.Types, productParams.Brands)
                     .AsQueryable();

            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.MetaData);

            return products;
        }

        [HttpGet("{id}", Name = "GetProduct")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();

            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new { brands, types });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateNewProduct([FromForm] CreateProductDTO productDTO)
        {
            var product = _mapper.Map<Product>(productDTO);

            if (productDTO.File != null)
            {
                var imageResult = await _imageService.UploadPhotoAsync(productDTO.File);

                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                product.PublicId = imageResult.PublicId;
                product.PictureUrl = imageResult.SecureUrl.ToString();
            }

            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);

            return BadRequest(new ProblemDetails { Title = "Failed to create new product" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdateProduct([FromForm] UpdateProductDTO updateDTO)
        {
            var currentProduct = await _context.Products.FindAsync(updateDTO.Id);
            if (currentProduct == null) return NotFound();
            _mapper.Map(updateDTO, currentProduct);
            if (updateDTO.File != null)
            {
                var imageResult = await _imageService.UploadPhotoAsync(updateDTO.File);
                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                if (string.IsNullOrEmpty(currentProduct.PublicId))
                    await _imageService.DeletePhotoAsync(currentProduct.PublicId);

                currentProduct.PictureUrl = imageResult.SecureUrl.ToString();
                currentProduct.PublicId = imageResult.PublicId;
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(currentProduct);

            return BadRequest(new ProblemDetails { Title = "Problem updating product" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();


            if (string.IsNullOrEmpty(product.PublicId))
                await _imageService.DeletePhotoAsync(product.PublicId);


            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok("the product deleted successfully");

            return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
        }

    }
}
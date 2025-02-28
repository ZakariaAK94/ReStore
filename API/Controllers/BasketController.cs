using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name ="GetBasket")]
        public async Task<ActionResult<BasketDTO>> GetBasketItems()
        {
            var basket = await GetBasket();

            if (basket == null) return NotFound();
            return MapBasketToDTO(basket);
        }       

        [HttpPost]
        public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
        {
            var basket = await GetBasket();
            if(basket==null) basket = CreateBasket();

            var Product = await _context.Products.FindAsync(productId);

            if(Product == null) return NotFound();

            basket.AddItem(Product, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return CreatedAtRoute("GetBasket",MapBasketToDTO(basket));

            return BadRequest(new ProblemDetails{Title="failed to add item to the basket"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity)
        {
            var basket = await GetBasket();

            if(basket==null) basket = CreateBasket();

            var Product = await _context.Products.FindAsync(productId);

            if(Product == null) return NotFound();

            basket.RemoveItem(Product,quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return Ok();

            return BadRequest(new ProblemDetails{Title="remove item from basket  failed "});
        }

         private async Task<Basket> GetBasket()
        {
            return await _context.Baskets
                              .Include(i => i.Items)
                              .ThenInclude(p => p.Product)
                              .FirstOrDefaultAsync(u => u.BuyerId == Request.Cookies["buyerId"]);
        }

        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions{IsEssential=true, Expires = DateTime.Now.AddDays(30),};
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            var basket = new Basket{BuyerId=buyerId};
            _context.Baskets.Add(basket);     

            return basket;      
        }

         private BasketDTO MapBasketToDTO(Basket basket)
        {
            return new BasketDTO
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDTO
                {

                    ProductId = item.Product.Id,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }

    }
}
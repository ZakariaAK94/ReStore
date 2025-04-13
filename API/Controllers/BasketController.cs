using API.Data;
using API.DTOs;
using API.Entities;
using API.extensionMethods;
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

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDTO>> GetBasketItems()
        {
            var basket = await GetBasket(GetBuyerID());

            if (basket == null) return NotFound();
            return basket.MapBasketToDTO();
        }

        [HttpPost]
        public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
        {
            var basket = await GetBasket(GetBuyerID());
            if (basket == null) basket = CreateBasket();

            var Product = await _context.Products.FindAsync(productId);

            if (Product == null) return BadRequest(new ProblemDetails { Title = "Product not Found." });

            basket.AddItem(Product, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetBasket", basket.MapBasketToDTO());

            return BadRequest(new ProblemDetails { Title = "failed to add item to the basket" });
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity)
        {
            var basket = await GetBasket(GetBuyerID());

            if (basket == null) basket = CreateBasket();

            var Product = await _context.Products.FindAsync(productId);

            if (Product == null) return NotFound();

            basket.RemoveItem(Product, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "remove item from basket  failed " });
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
        private string GetBuyerID()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if (string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }
            var basket = new Basket { BuyerId = buyerId };
            _context.Baskets.Add(basket);

            return basket;
        }

    }
}
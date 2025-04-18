using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.extensionMethods
{
    public static class BasketExtensions
    {
        public static BasketDTO MapBasketToDTO(this Basket basket)
        {
            return new BasketDTO
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                PaymenyIntentId = basket.PaymentIntentId,
                ClientSecret = basket.ClientSecret,
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

        public static IQueryable<Basket> GetBasket(this IQueryable<Basket> query, string buyerId)
        {
            return query.Include(i => i.Items)
                        .ThenInclude(p => p.Product)
                        .Where(u => u.BuyerId == buyerId);
        }

    }
}
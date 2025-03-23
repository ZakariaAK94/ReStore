using API.DTOs;
using API.Entities.orderAggregates;
using Microsoft.EntityFrameworkCore;

namespace API.extensionMethods
{
    public static class OrderExtensions
    {
        public static IQueryable<OrderDTO> ProjectOrderToOrderDTO(this IQueryable<Order> query)
        {
            return query
            .Select(order => new OrderDTO
            {
                Id = order.Id,
                BuyerId = order.BuyerId,
                ShippingAddress = order.ShippingAddress,             
                OrderStatus = order.OrderStatus.ToString(),
                Date = order.Date,
                DeliveryFee = order.DeliveryFee,
                Subtotal = order.Subtotal,
                Total = order.GetTotal(),
                OrderItems = order.OrderItems
                            .Select(orderitem=>new OrderItemDTO
                            {
                                ProductId = orderitem.ItemOrdered.ProductId,
                                Name = orderitem.ItemOrdered.Name,
                                PictureUrl = orderitem.ItemOrdered.PictureUrl,
                                Price = orderitem.Price,
                                Quantity = orderitem.Quantity
                            }).ToList()
            }).AsNoTracking();
        }
    }
}
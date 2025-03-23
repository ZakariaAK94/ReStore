using API.Entities.orderAggregates;

namespace API.DTOs
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public shippingAddress ShippingAddress { get; set; }
        public DateTime Date { get; set; }

        public List<OrderItemDTO> OrderItems { get; set; }

        public long Subtotal { get; set; }
        public long DeliveryFee { get; set; }

        public string OrderStatus { get; set; }

        public long Total;
    }
}
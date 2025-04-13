using System.ComponentModel.DataAnnotations;

namespace API.Entities.orderAggregates
{
    public class Order
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        [Required]
        public shippingAddress ShippingAddress { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;

        public List<OrderItems> OrderItems { get; set; }

        public long Subtotal { get; set; }
        public long DeliveryFee { get; set; }

        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;

        public string PaymentIntentId { get; set; }

        public long GetTotal() => Subtotal + DeliveryFee;


    }
}
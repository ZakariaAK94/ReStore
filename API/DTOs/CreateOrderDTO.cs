using API.Entities.orderAggregates;

namespace API.DTOs
{
    public class CreateOrderDTO
    {
        public bool SaveAddress { get; set; }

        public shippingAddress Address { get; set; }

    }
}
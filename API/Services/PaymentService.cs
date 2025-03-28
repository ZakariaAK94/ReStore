using API.Entities;
using Stripe;

namespace API.Services
{
    public class PaymentService
    {
        private readonly IConfiguration _config;
        public PaymentService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
        {
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            var Service = new PaymentIntentService();

            var Intent = new PaymentIntent();

            var Subtotal = basket.Items.Sum(item=>item.Quantity*item.Product.Price);

            var DeliveryFees = Subtotal > 10000 ? 0 : 500;

            if(string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = Subtotal + DeliveryFees,
                    Currency = "usd",
                    PaymentMethodTypes = ["card"]
                };

                Intent = await Service.CreateAsync(options);

            }else
            {
                var options = new PaymentIntentUpdateOptions{
                    Amount = Subtotal + DeliveryFees
                };

                await Service.UpdateAsync(basket.PaymentIntentId, options);
            }

            return Intent;
        }
    }
}
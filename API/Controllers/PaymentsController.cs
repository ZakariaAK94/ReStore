using System.Net;
using API.Data;
using API.DTOs;
using API.Entities.orderAggregates;
using API.extensionMethods;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly PaymentService _paymentService;
        private readonly IConfiguration _config;
        public PaymentsController(StoreContext context, PaymentService paymentService, IConfiguration config)
        {
            _config = config;
            _paymentService = paymentService;
            _context = context;            
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDTO>> CreateOrUpdatePayment()
        {
            var basket = await _context.Baskets
                               .GetBasket(User.Identity.Name)
                               .FirstOrDefaultAsync();

            if(basket == null) return NotFound();

            var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

            if(intent==null) return BadRequest(new ProblemDetails{Title="Problem creating payment intent"});

            basket.PaymentIntentId ??= intent.Id ;
            basket.ClientSecret ??= intent.ClientSecret;

            // _context.Update(basket);

            var result = _context.SaveChanges() > 0;

            if(!result) return BadRequest(new ProblemDetails{Title="Problem saving data in database"});

            return basket.MapBasketToDTO();
            
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebHook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();        

            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-signature"],
            _config["StripeSettings:WbSecret"]);

            var charge = (Charge)stripeEvent.Data.Object;

            var order = await _context.Orders.FirstOrDefaultAsync(x=>x.PaymentIntentId == charge.PaymentIntentId);

            if(charge.Status == "succeeded") order.OrderStatus = OrderStatus.PaymentReceived;

            await _context.SaveChangesAsync();

            return new EmptyResult();
        }

    }
}
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.orderAggregates;
using API.extensionMethods;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context) =>  _context = context;

        [HttpGet]
        public async Task<List<OrderDTO>> GetOrders()
        {
            return await _context.Orders
                    .ProjectOrderToOrderDTO()
                    .Where(o=>o.BuyerId == User.Identity.Name)
                    .ToListAsync();
        }

        [HttpGet("{id}", Name ="GetOrder")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id)
        {
            return await _context.Orders
                    .ProjectOrderToOrderDTO()
                    .Where(o=>o.BuyerId == User.Identity.Name && o.Id == id )
                    .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult> CreateOrder(CreateOrderDTO orderDTO)
        {
            var basket = await _context.Baskets.GetBasket(User.Identity.Name).FirstOrDefaultAsync();

            if(basket == null) return BadRequest(new ProblemDetails{Title="Could not locate basket"});

            var items = new List<OrderItems>();

            foreach (var item in basket.Items)
            {
                 var productItem = await _context.Products.FindAsync(item.ProductId);
                 var itemOrdred = new ProductItemOrdered{
                    ProductId = productItem.Id,
                    Name= productItem.Name,
                    PictureUrl = productItem.PictureUrl
                 };

                 var orderItems = new OrderItems{
                    ItemOrdered = itemOrdred,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                 };
                items.Add(orderItems);
                 productItem.QuantityInStock-= item.Quantity;                
            }

            

            var Subtotal = items.Sum(item=>item.Price*item.Quantity);
            var DeliveryFee = Subtotal > 10000 ? 0 : 500;

            var order = new Order{
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDTO.Address,
                OrderItems = items,
                Subtotal = Subtotal,
                DeliveryFee = DeliveryFee,
                PaymentIntentId = basket.PaymentIntentId
            };

            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);

            if(orderDTO.SaveAddress)
            {
                var user = await _context.Users.Include(u=>u.Address)
                                               .FirstOrDefaultAsync(u=>u.UserName == User.Identity.Name);

                var Address = new UserAddress{
                FullName = orderDTO.Address.FullName,
                Address1 = orderDTO.Address.Address1,
                Address2 = orderDTO.Address.Address2,
                City = orderDTO.Address.City,
                State = orderDTO.Address.State,
                Zip = orderDTO.Address.Zip,
                Country = orderDTO.Address.Country,
               };
               
               user.Address = Address;
            }

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return CreatedAtRoute("GetOrder", new {id=order.Id}, order.Id);

            return BadRequest("Problem creating order");

            
        }
        
    }
    

}
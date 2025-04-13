namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }

        public string BuyerId { get; set; }


        public List<BasketItem> Items { get; set; } = [];

        public string PaymentIntentId { get; set; }
        public string ClientSecret { get; set; }

        public void AddItem(Product product, int quantity)
        {
            var existingItem = Items.FirstOrDefault(item => item.Product.Id == product.Id);

            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
            else
            {
                Items.Add(new BasketItem { Product = product, Quantity = quantity });
            }

        }

        public void RemoveItem(Product product, int quantity)
        {
            var Item = Items.FirstOrDefault(item => item.Product.Id == product.Id);
            if (Item == null) return;

            Item.Quantity -= quantity;

            if (Item.Quantity <= 0)
                Items.Remove(Item);
        }


    }
}
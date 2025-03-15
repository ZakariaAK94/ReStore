using API.Entities;

namespace API.extensionMethods
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderby)
        {
            if(string.IsNullOrEmpty(orderby)) return query.OrderBy(p=>p.Name);
            
            query = orderby switch{
                "price"=>query.OrderBy(p=>p.Price),
                "priceDesc"=>query.OrderByDescending(p=>p.Price),
                _=>query.OrderBy(p=>p.Name)
            };

            return query;
        }
                
        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if(string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchBy = searchTerm.Trim().ToLower();
            
            return query.Where(p=>p.Name.ToLower().Contains(lowerCaseSearchBy));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string types, string brands)
        {
            if(string.IsNullOrEmpty(types) && string.IsNullOrEmpty(brands)) return query;
            
            var brandsList = new List<string>();
            var typesList = new List<string>();

            if(!string.IsNullOrEmpty(types))
              typesList.AddRange([.. types.ToLower().Split(",")]);


            if(!string.IsNullOrEmpty(brands))
            brandsList.AddRange([.. brands.ToLower().Split(",")]);

           query = query.Where(p=> brandsList.Count==0 || brandsList.Contains(p.Brand.ToLower()));
           query = query.Where(p=> typesList.Count==0 || typesList.Contains(p.Type.ToLower()));

            return query;
        }
        
    }
}
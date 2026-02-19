export type Product = {
    id: string;
    name: string;
    artisan: string;
    country: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    badge?: string;
    inStock: boolean;
  };
  
  export const products: Product[] = [
    {
      id: "1",
      name: "Sacred Geometry Canvas",
      artisan: "Meera Pillai",
      country: "🇮🇳 India",
      price: 4200,
      oldPrice: 5500,
      rating: 5,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
      category: "Paintings",
      badge: "Bestseller",
      inStock: true,
    },
    {
      id: "2",
      name: "Terracotta Soul Vessel",
      artisan: "Amara Diallo",
      country: "🇸🇳 Senegal",
      price: 2800,
      rating: 4,
      reviews: 64,
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80",
      category: "Ceramics",
      badge: "New",
      inStock: true,
    },
    {
      id: "3",
      name: "Andean Loom Tapestry",
      artisan: "Rosa Quispe",
      country: "🇵🇪 Peru",
      price: 6500,
      oldPrice: 7200,
      rating: 5,
      reviews: 43,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
      category: "Textiles",
      badge: "Limited",
      inStock: true,
    },
    {
      id: "4",
      name: "Bronze Forest Spirit",
      artisan: "Takeshi Mori",
      country: "🇯🇵 Japan",
      price: 12000,
      rating: 5,
      reviews: 92,
      image: "https://images.unsplash.com/photo-1567593810070-7a3d471af022?w=400&q=80",
      category: "Sculptures",
      badge: "Premium",
      inStock: true,
    },
    {
      id: "5",
      name: "Silver Filigree Pendant",
      artisan: "Fatima Al-Rashidi",
      country: "🇲🇦 Morocco",
      price: 1850,
      oldPrice: 2200,
      rating: 4,
      reviews: 211,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
      category: "Jewelry",
      inStock: true,
    },
    {
      id: "6",
      name: "Kintsugi Bowl",
      artisan: "Yuki Tanaka",
      country: "🇯🇵 Japan",
      price: 3400,
      rating: 5,
      reviews: 77,
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80",
      category: "Ceramics",
      inStock: true,
    },
    {
      id: "7",
      name: "Batik Silk Scarf",
      artisan: "Dewi Sartika",
      country: "🇮🇩 Indonesia",
      price: 950,
      rating: 4,
      reviews: 183,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
      category: "Textiles",
      inStock: false,
    },
    {
      id: "8",
      name: "Warli Folk Art Panel",
      artisan: "Bhuri Bai",
      country: "🇮🇳 India",
      price: 3200,
      oldPrice: 3800,
      rating: 5,
      reviews: 55,
      image: "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400&q=80",
      category: "Paintings",
      inStock: true,
    },
  ];
  
  export const categories: string[] = [
    "All",
    "Paintings",
    "Sculptures",
    "Textiles",
    "Jewelry",
    "Ceramics",
  ];
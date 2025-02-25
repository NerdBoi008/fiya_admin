import { CartItem, Category, Product } from "@/types";

export const popularProductsData: Product[] = [
  {
    productId: "P001",
    imgSrc: '/useless/product-demo-img.webp',
    otherImgSrcSet: ['/useless/product-demo-img.webp', '/useless/Dehydrated vegetables.jpg', '/assets/hero-image.webp'],
    name: "Dehydrated Carrots",
    form: "Slices",
    weight: 200,
    actualPrice: 150,
    offerPrice: 120,
    rating: 4.5,
    ingredients: ["Carrots"],
    description: "Crispy and nutrient-rich dehydrated carrot slices.",
    highlights: ["Rich in Vitamin A", "No added preservatives", "Gluten-free"],
  },
  {
    productId: "P002",
    imgSrc: '/useless/product-demo-img.webp',
    otherImgSrcSet: ['/useless/product-demo-img.webp', '/useless/Dehydrated vegetables.jpg', '/assets/hero-image.webp'],
    name: "Dehydrated Spinach",
    form: "Leaves",
    weight: 100,
    actualPrice: 100,
    offerPrice: 85,
    rating: 4.2,
    ingredients: ["Spinach"],
    description: "Delicious dehydrated spinach leaves for your recipes.",
    highlights: [
      "High in iron",
      "Perfect for soups and smoothies",
      "Preservative-free",
    ],
  },
  {
    productId: "P003",
    imgSrc: '/useless/product-demo-img.webp',
    otherImgSrcSet: ['/useless/product-demo-img.webp', '/useless/Dehydrated vegetables.jpg', '/assets/hero-image.webp'],
    name: "Dehydrated Tomatoes",
    form: "Slices",
    weight: 200,
    actualPrice: 180,
    offerPrice: 150,
    rating: 4.7,
    ingredients: ["Tomatoes"],
    description: "Tangy dehydrated tomatoes for salads and cooking.",
    highlights: ["Rich in antioxidants", "Great for snacking", "No additives"],
  },
  {
    productId: "P004",
    imgSrc: '/useless/product-demo-img.webp',
    otherImgSrcSet: ['/useless/product-demo-img.webp', '/useless/Dehydrated vegetables.jpg', '/assets/hero-image.webp'],
    name: "Dehydrated Potatoes",
    form: "Chunks",
    weight: 250,
    actualPrice: 200,
    offerPrice: 170,
    rating: 4.3,
    ingredients: ["Potatoes"],
    description: "Perfectly dehydrated potatoes for stews and soups.",
    highlights: [
      "Quick to rehydrate",
      "Natural taste",
      "Ideal for long-term storage",
    ],
  },
  {
    productId: "P005",
    imgSrc: '/useless/product-demo-img.webp',
    otherImgSrcSet: ['/useless/product-demo-img.webp', '/useless/Dehydrated vegetables.jpg', '/assets/hero-image.webp'],
    name: "Dehydrated Apples",
    form: "Rings",
    weight: 150,
    actualPrice: 120,
    offerPrice: 100,
    rating: 4.8,
    ingredients: ["Apples"],
    description: "Sweet and chewy dehydrated apple rings.",
    highlights: [
      "High in fiber",
      "Great snack for kids",
      "No added sugar",
    ],
  },
  {
    productId: "P006",
    imgSrc: '/useless/product-demo-img.webp',
    otherImgSrcSet: ['/useless/product-demo-img.webp', '/useless/Dehydrated vegetables.jpg', '/assets/hero-image.webp'],
    name: "Dehydrated Onions",
    form: "Flakes",
    weight: 200,
    actualPrice: 150,
    offerPrice: 125,
    rating: 4.4,
    ingredients: ["Onions"],
    description: "Flavorful dehydrated onion flakes for cooking.",
    highlights: [
      "Perfect for curries",
      "Convenient to use",
      "Preservative-free",
    ],
  },
  {
    productId: "P007",
    imgSrc: '/useless/product-demo-img.webp',
    otherImgSrcSet: ['/useless/product-demo-img.webp', '/useless/Dehydrated vegetables.jpg', '/assets/hero-image.webp'],
    name: "Dehydrated Bell Peppers",
    form: "Strips",
    weight: 150,
    actualPrice: 140,
    offerPrice: 120,
    rating: 4.6,
    ingredients: ["Bell Peppers"],
    description: "Bright and flavorful dehydrated bell peppers.",
    highlights: [
      "Rich in Vitamin C",
      "Ideal for pizzas and pastas",
      "No artificial colors",
    ],
  },
  {
    productId: "P008",
    imgSrc: '/useless/product-demo-img.webp',
    otherImgSrcSet: ['/useless/product-demo-img.webp', '/useless/Dehydrated vegetables.jpg', '/assets/hero-image.webp'],
    name: "Dehydrated Mangoes",
    form: "Slices",
    weight: 200,
    actualPrice: 200,
    offerPrice: 180,
    rating: 4.9,
    ingredients: ["Mangoes"],
    description: "Naturally sweet and chewy dehydrated mango slices.",
    highlights: ["Packed with nutrients", "Perfect summer snack", "No sugar added"],
  },
  {
    productId: "P009",
    imgSrc: '/useless/product-demo-img.webp',
    otherImgSrcSet: ['/useless/product-demo-img.webp', '/useless/Dehydrated vegetables.jpg', '/assets/hero-image.webp'],
    name: "Dehydrated Pineapples",
    form: "Chunks",
    weight: 200,
    actualPrice: 180,
    offerPrice: 150,
    rating: 4.7,
    ingredients: ["Pineapples"],
    description: "Tropical dehydrated pineapple chunks.",
    highlights: ["Tangy and delicious", "Gluten-free", "Rich in Vitamin C"],
  },
  {
    productId: "P010",
    imgSrc: '/useless/product-demo-img.webp',
    otherImgSrcSet: ['/useless/product-demo-img.webp', '/useless/Dehydrated vegetables.jpg', '/assets/hero-image.webp'],
    name: "Dehydrated Beetroot",
    form: "Chips",
    weight: 150,
    actualPrice: 130,
    offerPrice: 100,
    rating: 4.3,
    ingredients: ["Beetroot"],
    description: "Crunchy and healthy dehydrated beetroot chips.",
    highlights: [
      "Rich in iron",
      "No added preservatives",
      "Perfect snack for health enthusiasts",
    ],
  },
];
  
export const categoriesData: Category[] = [
  {
    id: "C001",
    categoryName: "Dehydrated Vegetables",
    imgSrc: '/useless/Dehydrated vegetables.jpg',
    productsId: ["P001", "P002", "P003", "P004", "P006"],
  },
  {
    id: "C002",
    categoryName: "Dehydrated Fruits",
    imgSrc: '/useless/Dehydrated vegetables.jpg',
    productsId: ["P005", "P008", "P009"],
  },
  {
    id: "C003",
    categoryName: "Dehydrated Herbs",
    imgSrc: '/useless/Dehydrated vegetables.jpg',
    productsId: ["P007", "P010"],
  },
  {
    id: "C004",
    categoryName: "Dehydrated Snacks",
    imgSrc: '/useless/Dehydrated vegetables.jpg',
    productsId: ["P001", "P005", "P010"],
  },
  {
    id: "C005",
    categoryName: "Organic Dehydrated Foods",
    imgSrc: '/useless/Dehydrated vegetables.jpg',
    productsId: ["P002", "P006", "P008", "P009"],
  },
];

export const cartProductDetails: CartItem[] = [
  {
    "productName": "Dehydrated Spinach",
    "imgSrc": "/useless/product-demo-img.webp",
    "weight": 100,
    "actualPrice": 100,
    "quantity": 1,
    "productId": 'P001',
    offerPrice: 70
  },
  {
    "productName": "Dehydrated Potatoes",
    "imgSrc": "/useless/product-demo-img.webp",
    "weight": 250,
    "actualPrice": 100,
    "quantity": 2,
    "productId": 'P002',
    offerPrice: 70
  },
  {
    "productName": "Dehydrated Onions",
    "imgSrc": "/useless/product-demo-img.webp",
    "weight": 200,
    "actualPrice": 100,
    "quantity": 5,
    "productId": 'P003',
    offerPrice: 70
  }
]
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  fabric: string;
  color: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  sizes: string[];
  image: string;
  gallery: string[];
  description: string;
  tags: string[];
};

export const collections = [
  {
    name: "Festive Salwar Sets",
    copy: "Gold-accented silhouettes for pujas, sangeet evenings, and family celebrations.",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Everyday Cotton",
    copy: "Breathable handcrafted textures made for workdays, errands, and soft weekends.",
    image:
      "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Wedding Guest Edit",
    copy: "Premium festive pieces with graceful embroidery and rich festive drape.",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80",
  },
];

export const products: Product[] = [
  {
    id: "pa-001",
    slug: "gulab-zari-salwar-suit",
    name: "Gulab Zari Salwar Suit",
    category: "Festive",
    fabric: "Silk Blend",
    color: "Maroon",
    price: 4299,
    mrp: 5899,
    rating: 4.8,
    reviews: 142,
    sizes: ["XS", "S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
    ],
    description:
      "A deep maroon salwar suit finished with zari-inspired detailing, soft lining, and an elegant dupatta for festive evenings.",
    tags: ["Bestseller", "3D Preview"],
  },
  {
    id: "pa-002",
    slug: "noor-chanderi-kurta-set",
    name: "Noor Chanderi Kurta Set",
    category: "Occasion",
    fabric: "Chanderi",
    color: "Blush",
    price: 3799,
    mrp: 4999,
    rating: 4.7,
    reviews: 96,
    sizes: ["S", "M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80",
    ],
    description:
      "Lightweight Chanderi with a luminous blush tone, delicate neckline work, and trousers tailored for graceful movement.",
    tags: ["New"],
  },
  {
    id: "pa-003",
    slug: "aabha-cotton-palazzo-set",
    name: "Aabha Cotton Palazzo Set",
    category: "Casual",
    fabric: "Cotton",
    color: "Ivory",
    price: 2499,
    mrp: 3299,
    rating: 4.6,
    reviews: 78,
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
    ],
    description:
      "Easy cotton kurta with a relaxed palazzo bottom, made for breathable all-day wear without losing polish.",
    tags: ["Everyday"],
  },
  {
    id: "pa-004",
    slug: "sunehri-embroidered-anarkali",
    name: "Sunehri Embroidered Anarkali",
    category: "Wedding",
    fabric: "Georgette",
    color: "Gold",
    price: 6899,
    mrp: 8499,
    rating: 4.9,
    reviews: 211,
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1603217040830-34473db521a5?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603217040830-34473db521a5?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80",
    ],
    description:
      "A flowing Anarkali with ornate embroidery, soft flare, and a celebratory gold palette for wedding guest dressing.",
    tags: ["Premium", "Limited"],
  },
  {
    id: "pa-005",
    slug: "mehfil-mirror-work-set",
    name: "Mehfil Mirror Work Set",
    category: "Festive",
    fabric: "Rayon",
    color: "Teal",
    price: 3299,
    mrp: 4499,
    rating: 4.5,
    reviews: 64,
    sizes: ["S", "M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
    ],
    description:
      "A teal kurta set with mirror-work accents and a confident festive personality for intimate celebrations.",
    tags: ["Trending"],
  },
  {
    id: "pa-006",
    slug: "kesar-linen-straight-set",
    name: "Kesar Linen Straight Set",
    category: "Workwear",
    fabric: "Linen",
    color: "Mustard",
    price: 2899,
    mrp: 3699,
    rating: 4.4,
    reviews: 52,
    sizes: ["XS", "S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
    ],
    description:
      "A clean straight-cut linen set with refined tailoring, subtle color, and an elegant office-to-dinner rhythm.",
    tags: ["Workwear"],
  },
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

import { useEffect, useState } from "react";
import { images as defaultImages, products as defaultProducts, site as defaultSite } from "./site-data";

export interface ProductItem {
  id: string;
  name: string;
  category: "poultry_feed" | "fish_feed" | "livestock" | "other";
  categoryLabel: string;
  description: string;
  price: string;
  unit: string;
  image: string;
  inStock: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: string;
  totalPriceText: string;
  notes?: string;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  statusLabel: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  label: string;
  category: string;
  image: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  owner: string;
  phone: string;
  email: string;
  address: string;
  heroImage: string;
  videoTitle: string;
  videoDescription: string;
  videoUrl: string; // YouTube or direct video URL
}

const STORAGE_KEYS = {
  PRODUCTS: "kb_products_v1",
  ORDERS: "kb_orders_v1",
  GALLERY: "kb_gallery_v1",
  MESSAGES: "kb_messages_v1",
  SETTINGS: "kb_settings_v1",
};

// Initial Seeds
const initialProducts: ProductItem[] = [
  {
    id: "prod-1",
    name: "উন্নত মুরগির ফিড (Broiler & Layer)",
    category: "poultry_feed",
    categoryLabel: "মুরগির ফিড",
    description: "মুরগির বয়স ও পালনের পর্যায় অনুযায়ী সঠিক পুষ্টিমান সমৃদ্ধ ও দ্রুত বৃদ্ধির উপযোগী ব্যালেন্সড খাদ্য।",
    price: "২৫৫০",
    unit: "৫০ কেজি বস্তা",
    image: defaultImages.feedImage,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "উন্নত ভাসমান মাছের ফিড (Floating Feed)",
    category: "fish_feed",
    categoryLabel: "মাছের ফিড",
    description: "দায়িত্বশীল মাছ চাষ ও নিয়মিত খাদ্য ব্যবস্থাপনার জন্য উচ্চ প্রোটিনযুক্ত পুষ্টিকর ভাসমান ফিড।",
    price: "২৮০০",
    unit: "২৫ কেজি বস্তা",
    image: defaultImages.feedImage,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "সমন্বিত খামারের তাজা মাছ (তেলাপিয়া, রুই, কার্প)",
    category: "livestock",
    categoryLabel: "মাছ",
    description: "পানির নিচের পরিষ্কার জলাশয়ে নিয়মিত তদারকিতে বড় করা স্বাস্থ্যসম্মত ও তাজা মাছ।",
    price: "২২০",
    unit: "প্রতি কেজি",
    image: defaultImages.fishImage,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "ফার্ম ফ্রেশ ব্রয়লার ও সোনালী মুরগি",
    category: "livestock",
    categoryLabel: "মুরগি",
    description: "উঁচু ও খোলামেলা শেডে স্বাস্থ্যকর খাদ্য ও সুপেয় পানিতে বড় করা সুস্থ মুরগি।",
    price: "১৯০",
    unit: "প্রতি কেজি",
    image: defaultImages.poultryImage,
    inStock: true,
    createdAt: new Date().toISOString(),
  },
];

const initialGallery: GalleryItem[] = [
  { id: "gal-1", label: "পানির ওপর আধুনিক মুরগির খামার", category: "মুরগি চাষ", image: defaultImages.poultryImage },
  { id: "gal-2", label: "নিচের জলাশয়ে মাছের খাদ্য প্রয়োগ", category: "মাছ চাষ", image: defaultImages.fishImage },
  { id: "gal-3", label: "উন্নত মানের পুষ্টিকর ফিড স্টক", category: "ফিড", image: defaultImages.feedImage },
  { id: "gal-4", label: "মুরগির নিয়মিত স্বাস্থ্য ও খাদ্য পরিচর্যা", category: "পরিচর্যা", image: defaultImages.careImage },
  { id: "gal-5", label: "জলাশয়ের পানি ও মাছ পর্যবেক্ষণ", category: "পানি পরীক্ষা", image: defaultImages.waterImage },
  { id: "gal-6", label: "খামার বাড়ির পুরো সমন্বিত দৃশ্য", category: "খামার পরিবেশ", image: defaultImages.heroImage },
  { id: "gal-7", label: "খামারের পরিষ্কার-পরিচ্ছন্নতা কার্যক্রম", category: "পরিচ্ছন্নতা", image: defaultImages.cleanImage },
];

const initialSettings: SiteSettings = {
  name: defaultSite.name,
  tagline: defaultSite.tagline,
  owner: defaultSite.owner,
  phone: defaultSite.phone,
  email: "khamarbari.cumilla@gmail.com",
  address: defaultSite.address,
  heroImage: defaultImages.heroImage,
  videoTitle: "খামার বাড়ির সমন্বিত কার্যক্রম",
  videoDescription: "পানির ওপর মুরগির খামার ও নিচে মাছ চাষের সমন্বিত বাস্তব ভিডিও দৃশ্য।",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Default sample video or embed
};

const initialOrders: OrderItem[] = [
  {
    id: "KB-2001",
    customerName: "আব্দুল করিম",
    phone: "01712345678",
    address: "মনোহরগঞ্জ, কুমিল্লা",
    productId: "prod-1",
    productName: "উন্নত মুরগির ফিড (Broiler & Layer)",
    quantity: 2,
    unit: "৫০ কেজি বস্তা",
    pricePerUnit: "২৫৫০",
    totalPriceText: "৫,১০০ ৳",
    notes: "কালকে সকাল ১০টার মধ্যে ডেলিভারি প্রয়োজন।",
    status: "pending",
    statusLabel: "অপেক্ষমাণ",
    createdAt: "২০২৬-১১-২৪, দুপুর ১২:৩০",
  },
  {
    id: "KB-2002",
    customerName: "মো: রফিকুল ইসলাম",
    phone: "01823456789",
    address: "লাকসাম বাইপাস, কুমিল্লা",
    productId: "prod-2",
    productName: "উন্নত ভাসমান মাছের ফিড (Floating Feed)",
    quantity: 4,
    unit: "২৫ কেজি বস্তা",
    pricePerUnit: "২৮০০",
    totalPriceText: "১১,২০০ ৳",
    notes: "ভ্যানে সরাসরি খামারে পৌঁছে দিতে হবে।",
    status: "confirmed",
    statusLabel: "নিশ্চিত",
    createdAt: "২০২৬-১১-২৩, বিকাল ৪:১৫",
  },
];

const initialMessages: ContactMessage[] = [
  {
    id: "msg-1",
    name: "জসিম উদ্দিন",
    phone: "01987654321",
    email: "jasim@gmail.com",
    subject: "পাইকারি ফিড ক্রয় সম্পর্কে",
    message: "আসসালামু আলাইকুম, আমি নিয়মিত ২০ বস্তা করে মুরগির ফিড নিতে চাই। পাইকারি দরে কিছু ছাড় পাওয়া যাবে কি?",
    date: "২০২৬-১১-২৪",
    isRead: false,
  },
];

// Helper to safely read from localStorage
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error("Failed to read storage key:", key, e);
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("kb_storage_update"));
  } catch (e) {
    console.error("Failed to set storage key:", key, e);
  }
}

// Global Store API
export const farmStore = {
  // Products
  getProducts(): ProductItem[] {
    return getLocal<ProductItem[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
  },
  saveProduct(product: Omit<ProductItem, "id" | "createdAt"> & { id?: string }): ProductItem {
    const products = farmStore.getProducts();
    if (product.id) {
      // Edit
      const index = products.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        products[index] = { ...products[index], ...product };
        setLocal(STORAGE_KEYS.PRODUCTS, products);
        return products[index];
      }
    }
    // Add new
    const newProduct: ProductItem = {
      ...product,
      id: "prod-" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    return newProduct;
  },
  deleteProduct(id: string): void {
    const products = farmStore.getProducts().filter((p) => p.id !== id);
    setLocal(STORAGE_KEYS.PRODUCTS, products);
  },

  // Orders
  getOrders(): OrderItem[] {
    return getLocal<OrderItem[]>(STORAGE_KEYS.ORDERS, initialOrders);
  },
  createOrder(orderData: {
    customerName: string;
    phone: string;
    address: string;
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
    pricePerUnit: string;
    notes?: string;
  }): OrderItem {
    const orders = farmStore.getOrders();
    const priceNum = parseInt(orderData.pricePerUnit.replace(/[^0-9]/g, ""), 10) || 0;
    const total = priceNum * orderData.quantity;
    const totalPriceText = total > 0 ? `${total.toLocaleString("bn-BD")} ৳` : "আলোচনা সাপেক্ষে";

    const newOrder: OrderItem = {
      ...orderData,
      id: "KB-" + (Math.floor(1000 + Math.random() * 9000)),
      totalPriceText,
      status: "pending",
      statusLabel: "অপেক্ষমাণ",
      createdAt: new Date().toLocaleString("bn-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setLocal(STORAGE_KEYS.ORDERS, [newOrder, ...orders]);
    return newOrder;
  },
  updateOrderStatus(orderId: string, status: OrderItem["status"]): void {
    const labels: Record<OrderItem["status"], string> = {
      pending: "অপেক্ষমাণ",
      confirmed: "নিশ্চিত",
      delivered: "ডেলিভার্ড",
      cancelled: "বাতিল",
    };
    const orders = farmStore.getOrders().map((o) => {
      if (o.id === orderId) {
        return { ...o, status, statusLabel: labels[status] };
      }
      return o;
    });
    setLocal(STORAGE_KEYS.ORDERS, orders);
  },
  deleteOrder(orderId: string): void {
    const orders = farmStore.getOrders().filter((o) => o.id !== orderId);
    setLocal(STORAGE_KEYS.ORDERS, orders);
  },

  // Gallery
  getGallery(): GalleryItem[] {
    return getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, initialGallery);
  },
  addGalleryItem(item: Omit<GalleryItem, "id">): GalleryItem {
    const list = farmStore.getGallery();
    const newItem: GalleryItem = { ...item, id: "gal-" + Date.now() };
    setLocal(STORAGE_KEYS.GALLERY, [newItem, ...list]);
    return newItem;
  },
  deleteGalleryItem(id: string): void {
    const list = farmStore.getGallery().filter((g) => g.id !== id);
    setLocal(STORAGE_KEYS.GALLERY, list);
  },

  // Messages
  getMessages(): ContactMessage[] {
    return getLocal<ContactMessage[]>(STORAGE_KEYS.MESSAGES, initialMessages);
  },
  sendMessage(msg: Omit<ContactMessage, "id" | "date" | "isRead">): ContactMessage {
    const list = farmStore.getMessages();
    const newMsg: ContactMessage = {
      ...msg,
      id: "msg-" + Date.now(),
      date: new Date().toLocaleDateString("bn-BD"),
      isRead: false,
    };
    setLocal(STORAGE_KEYS.MESSAGES, [newMsg, ...list]);
    return newMsg;
  },
  markMessageRead(id: string): void {
    const list = farmStore.getMessages().map((m) => (m.id === id ? { ...m, isRead: true } : m));
    setLocal(STORAGE_KEYS.MESSAGES, list);
  },
  deleteMessage(id: string): void {
    const list = farmStore.getMessages().filter((m) => m.id !== id);
    setLocal(STORAGE_KEYS.MESSAGES, list);
  },

  // Settings
  getSettings(): SiteSettings {
    return getLocal<SiteSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
  },
  updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    const current = farmStore.getSettings();
    const updated = { ...current, ...settings };
    setLocal(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },
};

// React hook to listen to store updates live
export function useFarmData() {
  const [data, setData] = useState({
    products: farmStore.getProducts(),
    orders: farmStore.getOrders(),
    gallery: farmStore.getGallery(),
    messages: farmStore.getMessages(),
    settings: farmStore.getSettings(),
  });

  useEffect(() => {
    function refresh() {
      setData({
        products: farmStore.getProducts(),
        orders: farmStore.getOrders(),
        gallery: farmStore.getGallery(),
        messages: farmStore.getMessages(),
        settings: farmStore.getSettings(),
      });
    }

    // Initial load sync
    refresh();

    window.addEventListener("kb_storage_update", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("kb_storage_update", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return data;
}

import heroImage from "@/assets/farm-hero.jpg";
import poultryImage from "@/assets/poultry-farm.jpg";
import fishImage from "@/assets/fish-farm.jpg";
import feedImage from "@/assets/farm-feed.jpg";
import careImage from "@/assets/activity-care.jpg";
import waterImage from "@/assets/activity-water.jpg";
import cleanImage from "@/assets/activity-clean.jpg";

export const site = {
  name: "খামার বাড়ি",
  tagline: "আধুনিক কৃষি, সমন্বিত খামার, মানসম্মত উৎপাদন",
  owner: "Fazle Elahi Nasir",
  phone: "01819929185",
  email: "",
  address: "Shopura, Lokkhon Pur, Monohorgonj, Cumilla, Bangladesh",
  mapUrl: "",
  videoUrl: "",
  socials: { facebook: "", youtube: "", instagram: "" },
};

export const images = { heroImage, poultryImage, fishImage, feedImage, careImage, waterImage, cleanImage };

export const products = [
  { name: "মুরগির ফিড", description: "মুরগির বয়স ও পালনের পর্যায় অনুযায়ী উপযোগী, মানসম্মত খাদ্য।", image: feedImage, price: "" },
  { name: "মাছের ফিড", description: "দায়িত্বশীল মাছ চাষ ও নিয়মিত খাদ্য ব্যবস্থাপনার জন্য প্রয়োজনীয় ফিড।", image: feedImage, price: "" },
  { name: "অন্যান্য খামার খাদ্য", description: "খামারের দৈনন্দিন পরিচর্যায় প্রয়োজনীয় নির্বাচিত খাদ্য ও সহায়ক উপকরণ।", image: feedImage, price: "" },
];

export const navItems = [
  { label: "হোম", to: "/" },
  { label: "আমাদের সম্পর্কে", to: "/about" },
  { label: "মুরগি চাষ", to: "/poultry" },
  { label: "মাছ চাষ", to: "/fish" },
  { label: "ফিড ও খাদ্য", to: "/feed" },
  { label: "আমাদের কার্যক্রম", to: "/activities" },
  { label: "গ্যালারি", to: "/gallery" },
  { label: "যোগাযোগ", to: "/contact" },
] as const;
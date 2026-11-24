import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MapPin, Phone, Youtube } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { navItems, site } from "@/lib/site-data";

export function SiteFooter() {
  return <footer className="bg-primary text-primary-foreground">
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
      <div><BrandLogo inverse /><p className="mt-5 max-w-md leading-7 text-primary-foreground/75">পানির ওপর পরিকল্পিত মুরগির খামার এবং নিচের জলাশয়ে মাছ চাষ—দায়িত্বশীল পরিচর্যায় গড়ে ওঠা একটি সমন্বিত কৃষি উদ্যোগ।</p><p className="mt-4 text-sm font-semibold text-accent">{site.tagline}</p></div>
      <div><h2 className="font-display text-lg">দ্রুত লিংক</h2><div className="mt-5 grid grid-cols-2 gap-3">{navItems.filter((_, i) => i !== 5).map((item) => <Link key={item.to} to={item.to} className="text-sm text-primary-foreground/70 hover:text-accent">{item.label}</Link>)}</div></div>
      <div><h2 className="font-display text-lg">যোগাযোগ</h2><div className="mt-5 space-y-4 text-sm text-primary-foreground/75"><a href={`tel:${site.phone}`} className="flex gap-3 hover:text-accent"><Phone className="size-5 shrink-0" />{site.phone}</a><p className="flex gap-3"><MapPin className="size-5 shrink-0" />Shopura, Lokkhon Pur, Monohorgonj, Cumilla</p></div><div className="mt-6 flex gap-2">{[Facebook, Youtube, Instagram].map((Icon, i) => <a key={i} href="#" aria-label={["ফেসবুক", "ইউটিউব", "ইনস্টাগ্রাম"][i]} className="grid size-10 place-items-center rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground"><Icon className="size-4" /></a>)}</div></div>
    </div>
    <div className="border-t border-primary-foreground/10 px-5 py-5 text-center text-xs text-primary-foreground/60">© ২০২৬ খামার বাড়ি। সর্বস্বত্ব সংরক্ষিত।</div>
  </footer>;
}
import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { Button } from "./ui/button";
import { navItems, site } from "@/lib/site-data";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" aria-label="খামার বাড়ি হোম"><BrandLogo /></Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="প্রধান নেভিগেশন">
          {navItems.map((item) => <Link key={item.to} to={item.to} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary" activeProps={{ className: "text-primary bg-secondary" }}>{item.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 xl:flex">
          <a className="flex items-center gap-2 text-sm font-semibold text-primary" href={`tel:${site.phone}`}><Phone className="size-4" />{site.phone}</a>
          <Button asChild><Link to="/contact">যোগাযোগ করুন</Link></Button>
        </div>
        <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setOpen(!open)} aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <nav className="border-t border-border bg-background px-5 py-4 xl:hidden" aria-label="মোবাইল নেভিগেশন">
        <div className="mx-auto grid max-w-7xl gap-1">{navItems.map((item) => <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 font-medium text-foreground hover:bg-secondary">{item.label}</Link>)}<Button asChild className="mt-2"><Link to="/contact" onClick={() => setOpen(false)}>যোগাযোগ করুন</Link></Button></div>
      </nav>}
    </header>
  );
}
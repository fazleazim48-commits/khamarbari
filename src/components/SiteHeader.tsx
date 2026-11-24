import { Link } from "@tanstack/react-router";
import { Menu, Phone, ShieldCheck, User, LogOut, X } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { Button } from "./ui/button";
import { navItems } from "@/lib/site-data";
import { useFarmData } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { settings } = useFarmData();
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" aria-label="খামার বাড়ি হোম">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="প্রধান নেভিগেশন">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
              activeProps={{ className: "text-primary bg-secondary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <a
            className="flex items-center gap-2 text-sm font-semibold text-primary"
            href={`tel:${settings.phone}`}
          >
            <Phone className="size-4" />
            {settings.phone}
          </a>

          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="default" className="gap-1.5 font-bold shadow-sm bg-primary">
                <Link to="/admin">
                  <ShieldCheck className="size-4" />
                  অ্যাডমিন ড্যাশবোর্ড
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-xs text-muted-foreground hover:text-destructive"
                title="লগআউট"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground bg-secondary px-2.5 py-1.5 rounded-md">
                👤 {user.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                লগআউট
              </Button>
            </div>
          ) : (
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
              <Link to="/login">
                <User className="size-3.5" />
                লগইন / অ্যাডমিন
              </Link>
            </Button>
          )}

          <Button asChild>
            <Link to="/contact">যোগাযোগ</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="xl:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 py-4 xl:hidden" aria-label="মোবাইল নেভিগেশন">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 font-medium text-foreground hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-border mt-2 pt-3 flex flex-col gap-2">
              <a
                className="flex items-center gap-2 text-sm font-semibold text-primary py-2"
                href={`tel:${settings.phone}`}
              >
                <Phone className="size-4" /> কল করুন: {settings.phone}
              </a>

              {isAdmin ? (
                <Button asChild className="w-full gap-2 font-bold" onClick={() => setOpen(false)}>
                  <Link to="/admin">
                    <ShieldCheck className="size-4" /> অ্যাডমিন ড্যাশবোর্ড
                  </Link>
                </Button>
              ) : user ? (
                <div className="flex items-center justify-between bg-secondary p-2.5 rounded-md">
                  <span className="text-xs font-semibold">{user.name}</span>
                  <Button variant="ghost" size="sm" onClick={logout} className="text-xs text-destructive">
                    লগআউট
                  </Button>
                </div>
              ) : (
                <Button asChild variant="outline" className="w-full gap-2 text-xs font-bold" onClick={() => setOpen(false)}>
                  <Link to="/login">
                    <User className="size-4" /> লগইন / অ্যাডমিন
                  </Link>
                </Button>
              )}

              <Button asChild className="w-full" onClick={() => setOpen(false)}>
                <Link to="/contact">যোগাযোগ করুন</Link>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

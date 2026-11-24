import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { User, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth, DEFAULT_ADMIN } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "লগইন — খামার বাড়ি" },
      { name: "description", content: "খামার বাড়ি অ্যাডমিন ও ইউজার লগইন পোর্টাল।" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, login, register, isAdmin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // If already logged in
  if (user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-lg">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-8" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold">আপনি ইতিমধ্যে লগইন আছেন</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            লগইনকৃত অ্যাকাউন্ট: <strong className="text-foreground">{user.name}</strong> ({user.role === "admin" ? "অ্যাডমিন" : "গ্রাহক"})
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {isAdmin ? (
              <Button asChild size="lg">
                <Link to="/admin">অ্যাডমিন ড্যাশবোর্ডে যান</Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link to="/">মূল ওয়েবসাইটে যান</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const res = login(emailOrPhone, password);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        if (emailOrPhone.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() || emailOrPhone === DEFAULT_ADMIN.phone) {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/" });
        }
      }, 500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name) {
      setErrorMsg("দয়া করে আপনার নাম লিখুন।");
      return;
    }

    const res = register(name, emailOrPhone, password);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        navigate({ to: "/" });
      }, 700);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="border-b border-border bg-primary/5 p-6 text-center">
          <div className="flex justify-center mb-2">
            <BrandLogo />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {isRegister ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "অ্যাকাউন্টে প্রবেশ করুন"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {isRegister ? "অর্ডার ট্র্যাক ও সহজ যোগাযোগের জন্য নিবন্ধন করুন" : "অ্যাডমিন ড্যাশবোর্ড ও কাস্টমার পোর্টাল"}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8">
          {errorMsg && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs text-primary">
              <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
            {isRegister && (
              <label className="block text-xs font-semibold text-foreground">
                <span>আপনার সম্পূর্ণ নাম</span>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: মো: করিম উদ্দিন"
                    className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </label>
            )}

            <label className="block text-xs font-semibold text-foreground">
              <span>ইমেইল অথবা মোবাইল নম্বর</span>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="admin@khamarbari.com বা 018..."
                  className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </label>

            <label className="block text-xs font-semibold text-foreground">
              <span>পাসওয়ার্ড</span>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition"
                  aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>

            <Button type="submit" size="lg" className="w-full mt-2">
              {isRegister ? "নিবন্ধন সম্পন্ন করুন" : "লগইন করুন"} <ArrowRight className="size-4 ml-1" />
            </Button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
            {isRegister ? (
              <p>
                ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setErrorMsg("");
                  }}
                  className="font-bold text-primary hover:underline"
                >
                  এখানে লগইন করুন
                </button>
              </p>
            ) : (
              <p>
                নতুন কাস্টমার?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setErrorMsg("");
                  }}
                  className="font-bold text-primary hover:underline"
                >
                  অ্যাকাউন্ট তৈরি করুন
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, type FormEvent } from "react";
import { CheckCircle2, MapPin, Send } from "lucide-react";
import { Button } from "./ui/button";
import { farmStore, useFarmData } from "@/lib/store";

export function ContactForm() {
  const { settings } = useFarmData();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name || !phone || !message) {
      alert("দয়া করে নাম, ফোন নম্বর এবং বার্তা লিখুন।");
      return;
    }

    farmStore.sendMessage({
      name,
      phone,
      email,
      subject,
      message,
    });

    setSent(true);
    setName("");
    setPhone("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
      <form onSubmit={submit} className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-foreground">
            <span>আপনার নাম *</span>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="মো: রহিম"
              className="h-12 rounded-md border border-input bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-foreground">
            <span>ফোন নম্বর *</span>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="018XXXXXXXX"
              className="h-12 rounded-md border border-input bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-foreground">
            <span>ইমেইল (ঐচ্ছিক)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="h-12 rounded-md border border-input bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-foreground">
            <span>বিষয়</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="ফিড ক্রয় / পরামর্শ"
              className="h-12 rounded-md border border-input bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
        </div>

        <label className="mt-5 grid gap-2 text-sm font-semibold text-foreground">
          <span>আপনার বার্তা *</span>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="আপনার প্রশ্ন বা প্রয়োজনীয় তথ্য বিস্তারিত লিখুন..."
            className="rounded-md border border-input bg-background p-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>

        <Button type="submit" size="lg" className="mt-6 gap-2">
          <Send className="size-4" /> বার্তা পাঠান
        </Button>

        {sent && (
          <p role="status" className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary animate-in fade-in">
            <CheckCircle2 className="size-5" /> ধন্যবাদ। আপনার বার্তাটি সফলভাবে আমাদের অ্যাডমিন প্যানেলে জমা হয়েছে!
          </p>
        )}
      </form>

      <div className="grid min-h-96 place-items-center rounded-lg bg-secondary p-8 text-center">
        <div>
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-background text-primary shadow-sm">
            <MapPin className="size-7" />
          </span>
          <h3 className="mt-5 font-display text-2xl">খামারের অবস্থান</h3>
          <p className="mx-auto mt-3 max-w-sm leading-7 text-muted-foreground">{settings.address}</p>
          <p className="mt-4 font-semibold text-primary">সরাসরি কল: {settings.phone}</p>
        </div>
      </div>
    </div>
  );
}

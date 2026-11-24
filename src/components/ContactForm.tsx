import { useState, type FormEvent } from "react";
import { CheckCircle2, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { site } from "@/lib/site-data";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  return <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
    <form onSubmit={submit} className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">{["নাম", "ফোন নম্বর", "ইমেইল", "বিষয়"].map((label, i) => <label key={label} className="grid gap-2 text-sm font-semibold text-foreground"><span>{label}</span><input required={i < 2} type={i === 2 ? "email" : "text"} className="h-12 rounded-md border border-input bg-background px-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>)}</div>
      <label className="mt-5 grid gap-2 text-sm font-semibold text-foreground"><span>আপনার বার্তা</span><textarea required rows={5} className="rounded-md border border-input bg-background p-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
      <Button type="submit" size="lg" className="mt-6">বার্তা পাঠান</Button>
      {sent && <p role="status" className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary"><CheckCircle2 className="size-5" />ধন্যবাদ। আপনার বার্তাটি গ্রহণের জন্য প্রস্তুত করা হয়েছে।</p>}
    </form>
    <div className="grid min-h-96 place-items-center rounded-lg bg-secondary p-8 text-center"><div><span className="mx-auto grid size-16 place-items-center rounded-full bg-background text-primary shadow-sm"><MapPin className="size-7" /></span><h3 className="mt-5 font-display text-2xl">খামারের অবস্থান</h3><p className="mx-auto mt-3 max-w-sm leading-7 text-muted-foreground">{site.address}</p><p className="mt-6 text-xs font-semibold text-accent-strong">গুগল ম্যাপ লোকেশন পরে এখানে যুক্ত করা যাবে</p></div></div>
  </div>;
}
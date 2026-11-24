import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageIntro } from "./PageIntro";
import { SectionHeading } from "./SectionHeading";
import { Button } from "./ui/button";

export function DetailPage({ eyebrow, title, description, image, points, body }: { eyebrow: string; title: string; description: string; image: string; points: string[]; body: string }) {
  return <><PageIntro eyebrow={eyebrow} title={title} description={description} image={image} /><section className="section-shell"><div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center lg:px-8"><div><SectionHeading eyebrow="সুশৃঙ্খল ব্যবস্থাপনা" title="যত্ন, পরিচ্ছন্নতা ও নিয়মিত পর্যবেক্ষণ" description={body} /><ul className="mt-7 grid gap-3 sm:grid-cols-2">{points.map((point) => <li key={point} className="flex items-center gap-3 rounded-md bg-secondary p-4 font-semibold"><CheckCircle2 className="size-5 shrink-0 text-primary" />{point}</li>)}</ul><Button asChild size="lg" className="mt-8"><Link to="/contact">যোগাযোগ করুন <ArrowRight className="size-4" /></Link></Button></div><img src={image} alt={title} loading="lazy" width={1408} height={1008} className="aspect-[4/3] w-full rounded-lg object-cover shadow-xl" /></div></section></>;
}
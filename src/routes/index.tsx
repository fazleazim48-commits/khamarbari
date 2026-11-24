import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bird, CheckCircle2, Droplets, Fish, Play, ShieldCheck, Sprout, Wheat, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { OrderModal } from "@/components/OrderModal";
import { VideoModal } from "@/components/VideoModal";
import { useFarmData, type ProductItem } from "@/lib/store";
import { images } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "খামার বাড়ি — সমন্বিত মুরগি ও মাছ চাষ" },
      { name: "description", content: "কুমিল্লায় আধুনিক সমন্বিত মুরগি ও মাছ চাষ, মানসম্মত ফিড এবং দায়িত্বশীল খামার ব্যবস্থাপনা।" },
      { property: "og:title", content: "খামার বাড়ি — আধুনিক সমন্বিত খামার" },
      { property: "og:description", content: "পানির ওপর মুরগির খামার ও নিচে মাছ চাষের পরিকল্পিত সমন্বয়।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const steps = [
  { icon: Bird, title: "মুরগি চাষ", text: "উপরের পরিকল্পিত ও বাতাস চলাচলযোগ্য খামার কাঠামোতে নিয়মিত পরিচর্যায় মুরগি পালন।" },
  { icon: Fish, title: "মাছ চাষ", text: "নিচের জলাশয় ও নির্ধারিত পানির এলাকায় পরিবেশ পর্যবেক্ষণের মাধ্যমে মাছ চাষ।" },
  { icon: Wheat, title: "খাদ্য ব্যবস্থাপনা", text: "মুরগি ও মাছের ধরন ও পর্যায় বিবেচনায় মানসম্মত খাদ্যের সুশৃঙ্খল ব্যবহার।" },
  { icon: ShieldCheck, title: "পরিচর্যা ও মান নিয়ন্ত্রণ", text: "পরিচ্ছন্নতা, পানির অবস্থা ও প্রাণীর স্বাস্থ্য নিয়মিত পর্যবেক্ষণ।" },
];

const reasons = [
  "আধুনিক খামার ব্যবস্থাপনা",
  "মানসম্মত খাদ্য",
  "সমন্বিত মুরগি ও মাছ চাষ",
  "পরিচ্ছন্ন ও দায়িত্বশীল ব্যবস্থাপনা",
  "মানের প্রতি গুরুত্ব",
  "গ্রাহকের প্রতি বিশ্বাসযোগ্যতা",
];

const activities = [
  { title: "মুরগির যত্ন ও খাদ্য প্রদান", text: "প্রতিদিন খাবার, পানি ও মুরগির সামগ্রিক অবস্থা দেখা হয়।", image: images.careImage },
  { title: "পানি ও মাছ পর্যবেক্ষণ", text: "জলাশয়ের পানি, মাছের চলাচল ও খাবার গ্রহণ নিয়মিত দেখা হয়।", image: images.waterImage },
  { title: "খামার পরিষ্কার-পরিচ্ছন্নতা", text: "পরিকল্পিত রুটিনে শেড, চলাচলের পথ ও সরঞ্জাম পরিষ্কার রাখা হয়।", image: images.cleanImage },
];

function Home() {
  const { products, settings, gallery } = useFarmData();
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleOrder = (product: ProductItem) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative isolate min-h-[78vh] overflow-hidden">
        <img
          src={images.heroImage}
          alt="পানির ওপর মুরগির খামার ও নিচে মাছ চাষ"
          width={1600}
          height={1008}
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="mx-auto flex min-h-[78vh] max-w-7xl items-center px-5 py-20 lg:px-8">
          <div className="max-w-3xl text-primary-foreground">
            <div className="mb-5 inline-flex items-center gap-2 border-l-2 border-accent pl-3 text-sm font-semibold text-accent">
              <Sprout className="size-4" />
              {settings.tagline}
            </div>
            <h1 className="font-display text-4xl leading-[1.15] md:text-6xl lg:text-7xl">
              এক খামারে মুরগি ও মাছ চাষের আধুনিক সমন্বয়
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/80">
              পানির ওপর পরিকল্পিত উঁচু কাঠামোতে মুরগি পালন এবং নিচের জলাশয়ে মাছ চাষ—পরিচ্ছন্নতা, সঠিক খাদ্য ও নিয়মিত পর্যবেক্ষণে পরিচালিত খামার বাড়ির সমন্বিত উদ্যোগ।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="light" size="lg">
                <Link to="/about">আমাদের সম্পর্কে জানুন</Link>
              </Button>
              <Button asChild size="lg" className="border border-primary-foreground/35 bg-primary-foreground/10 backdrop-blur hover:bg-primary-foreground/20">
                <Link to="/feed">
                  পণ্য ও ফিড দেখুন <ArrowRight className="size-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-shell">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative">
            <img
              src={images.fishImage}
              alt="খামার বাড়ির সমন্বিত খামার পরিবেশ"
              loading="lazy"
              width={1408}
              height={1008}
              className="aspect-[4/3] w-full rounded-lg object-cover shadow-xl"
            />
            <div className="absolute -bottom-5 -right-3 rounded-md bg-primary p-5 text-primary-foreground shadow-xl md:right-8">
              <strong className="font-display text-xl">পরিচালনায়</strong>
              <span className="mt-1 block text-sm text-primary-foreground/75">{settings.owner}</span>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="আমাদের পরিচয়"
              title="একই পরিসরে দুই ধরনের দায়িত্বশীল চাষ"
              description="খামার বাড়ি একটি উদ্ভাবনী সমন্বিত কৃষি উদ্যোগ। এখানে পানির ওপর নির্মিত উঁচু, বাতাস চলাচলযোগ্য কাঠামোতে মুরগি পালন করা হয় এবং তার নিচে ও চারপাশের নির্ধারিত জলাশয়ে মাছ চাষ পরিচালিত হয়।"
            />
            <p className="mt-5 leading-8 text-muted-foreground">
              আলাদা পরিচর্যা পরিকল্পনা, খাদ্যের সঠিক ব্যবহার, পরিচ্ছন্নতা এবং নিয়মিত পর্যবেক্ষণের মাধ্যমে পুরো খামারকে সুশৃঙ্খলভাবে পরিচালনা করাই আমাদের লক্ষ্য। পাশাপাশি খামারিদের জন্য মুরগি ও মাছের মানসম্মত ফিড সরবরাহ করা হয়।
            </p>
            <Button asChild variant="secondary" size="lg" className="mt-7">
              <Link to="/about">
                আরও জানুন <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4 Step Process */}
      <section className="section-shell bg-secondary">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            center
            eyebrow="সমন্বিত খামার পদ্ধতি"
            title="পরিকল্পিত চারটি ধাপে পরিচালনা"
            description="মুরগি, মাছ, খাদ্য ও পরিচর্যা—প্রতিটি অংশকে আলাদাভাবে গুরুত্ব দিয়ে একই ব্যবস্থার মধ্যে সমন্বয় করা হয়।"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <article key={title} className="relative rounded-lg border border-border bg-card p-6 shadow-sm">
                <span className="absolute right-5 top-4 font-display text-4xl text-border">০{i + 1}</span>
                <span className="grid size-12 place-items-center rounded-md bg-primary text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 font-display text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Main Works */}
      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="আমাদের প্রধান কাজ" title="মুরগি ও মাছ চাষ—দুই ক্ষেত্রেই সমান যত্ন" />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: "পরিকল্পিত মুরগি পালন",
                text: "বাতাস চলাচল, খাদ্য ও পানির সুব্যবস্থা, শেডের পরিচ্ছন্নতা এবং মুরগির স্বাস্থ্যকর পরিবেশ নিশ্চিত করতে নিয়মিত কাজ করা হয়।",
                image: images.poultryImage,
                to: "/poultry" as const,
              },
              {
                title: "দায়িত্বশীল মাছ চাষ",
                text: "পানির পরিবেশ, মাছের আচরণ ও খাদ্য গ্রহণ পর্যবেক্ষণ করে নির্ধারিত সময়ে পরিচর্যা ও খাবার দেওয়া হয়।",
                image: images.fishImage,
                to: "/fish" as const,
              },
            ].map((item) => (
              <article key={item.title} className="group overflow-hidden rounded-lg bg-card shadow-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  width={1408}
                  height={1008}
                  className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                <div className="p-7">
                  <h3 className="font-display text-2xl">{item.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.text}</p>
                  <Link to={item.to} className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">
                    বিস্তারিত জানুন <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Feed & Products Section */}
      <section className="section-shell bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
          <img
            src={images.feedImage}
            alt="মুরগি ও মাছের মানসম্মত ফিড"
            loading="lazy"
            width={1408}
            height={1008}
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
          <div>
            <SectionHeading
              eyebrow="ফিড ও খাদ্য সামগ্রী"
              title="খামারের প্রয়োজন অনুযায়ী নির্বাচিত খাদ্য"
              description="নিজস্ব ব্যবহারের পাশাপাশি খামারিদের জন্য মুরগি ও মাছের মানসম্মত ফিড সরবরাহ ও সরাসরি অর্ডারের সুযোগ রয়েছে।"
            />
            <div className="mt-7 grid gap-3">
              {products.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 p-4"
                >
                  <div>
                    <h3 className="font-display text-lg font-bold">{product.name}</h3>
                    <p className="mt-0.5 text-xs text-primary-foreground/75 line-clamp-1">{product.description}</p>
                    <span className="mt-1 text-xs font-semibold text-accent block">
                      {product.price ? `${product.price} ৳ / ${product.unit}` : "মূল্য জানতে কল করুন"}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleOrder(product)}
                    variant="light"
                    size="sm"
                    className="shrink-0 gap-1.5 font-bold ml-3"
                  >
                    <ShoppingBag className="size-3.5" /> অর্ডার
                  </Button>
                </div>
              ))}
            </div>
            <Button asChild variant="light" size="lg" className="mt-7 font-bold">
              <Link to="/feed">সব পণ্য ও অর্ডার তালিকা দেখুন</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading center eyebrow="কেন খামার বাড়ি" title="দায়িত্বশীল ব্যবস্থাপনায় বিশ্বাসের ভিত্তি" />
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((title, i) => (
              <article key={title} className="bg-card p-7">
                <span className="grid size-10 place-items-center rounded-full bg-secondary font-bold text-primary">
                  ০{i + 1}
                </span>
                <h3 className="mt-5 font-display text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  পরিকল্পিত কাজ, নিয়মিত পর্যবেক্ষণ ও মানসম্মত উপকরণ ব্যবহারের মাধ্যমে প্রতিটি ধাপে যত্ন নিশ্চিত করা হয়।
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Activities */}
      <section className="section-shell bg-secondary">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="প্রতিদিনের কাজ"
            title="খামারের নিয়মিত কার্যক্রম"
            description="খাদ্য প্রদান থেকে পানি পরীক্ষা—প্রতিদিনের প্রতিটি কাজ নির্ধারিত পর্যবেক্ষণের অংশ।"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {activities.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-lg bg-card shadow-sm">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  width={1200}
                  height={912}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="font-display text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Video Section with Interactive Player */}
      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative isolate grid min-h-[500px] place-items-center overflow-hidden rounded-2xl text-center">
            <img
              src={images.heroImage}
              alt="খামার বাড়ির ভিডিও প্রিভিউ"
              loading="lazy"
              width={1600}
              height={1008}
              className="absolute inset-0 -z-20 size-full object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-primary/80" />
            <div className="max-w-2xl px-6 text-primary-foreground">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                aria-label="ভিডিও চালু করুন"
                className="group mx-auto grid size-20 place-items-center rounded-full bg-accent text-accent-foreground shadow-2xl transition hover:scale-110"
              >
                <Play className="ml-1 size-8 fill-current group-hover:scale-110 transition" />
              </button>
              <h2 className="mt-7 font-display text-3xl md:text-5xl font-bold">
                {settings.videoTitle || "খামার বাড়ির কার্যক্রম দেখুন"}
              </h2>
              <p className="mt-4 leading-8 text-primary-foreground/80">
                {settings.videoDescription || "আমাদের সমন্বিত খামারের কাঠামো, পরিচর্যা ও প্রতিদিনের কাজ ভিডিওতে সরাসরি দেখুন। প্লে বাটনে ক্লিক করে এখনই উপভোগ করুন।"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-shell bg-secondary">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading center eyebrow="খামারের ছবি" title="কাজ ও পরিবেশের কিছু মুহূর্ত" />
          <div className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.slice(0, 5).map((item, i) => (
              <img
                key={item.id || item.label}
                src={item.image}
                alt={item.label}
                loading="lazy"
                width={i === 0 ? 1600 : 1408}
                height={1008}
                className={`size-full rounded-md object-cover ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              />
            ))}
          </div>
          <div className="mt-7 text-center">
            <Button asChild variant="secondary" size="lg">
              <Link to="/gallery">সম্পূর্ণ গ্যালারি দেখুন</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-10 grid gap-6 lg:grid-cols-2">
            <SectionHeading
              eyebrow="যোগাযোগ"
              title="আমাদের সাথে যোগাযোগ করুন"
              description="খামার, ফিড বা পণ্য সম্পর্কে জানতে সরাসরি ফোন করুন অথবা বার্তা পাঠান।"
            />
            <div className="flex flex-col justify-end lg:text-right">
              <p className="text-sm text-muted-foreground">সরাসরি ফোন কল</p>
              <a href={`tel:${settings.phone}`} className="font-display text-3xl font-bold text-primary">
                {settings.phone}
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Modals */}
      <OrderModal
        product={selectedProduct}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={settings.videoUrl}
        title={settings.videoTitle}
      />
    </>
  );
}

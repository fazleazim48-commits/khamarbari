import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/PageIntro";
import { useFarmData } from "@/lib/store";
import { images } from "@/lib/site-data";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "গ্যালারি — খামার বাড়ি" },
      { name: "description", content: "খামার বাড়ির মুরগির খামার, মাছ চাষ, ফিড ও প্রতিদিনের কার্যক্রমের ছবি।" },
      { property: "og:title", content: "গ্যালারি — খামার বাড়ি" },
      { property: "og:description", content: "সমন্বিত খামারের বাস্তব পরিবেশ ও পরিচর্যার মুহূর্ত।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { gallery } = useFarmData();

  return (
    <>
      <PageIntro
        eyebrow="গ্যালারি"
        title="খামারের বাস্তব কাজ ও পরিবেশ"
        description="মুরগি পালন, মাছ চাষ, খাদ্য ও দৈনন্দিন পরিচর্যার নির্বাচিত কিছু দৃশ্য।"
        image={images.heroImage}
      />
      <section className="section-shell">
        <div className="mx-auto columns-1 gap-5 px-5 sm:columns-2 lg:max-w-7xl lg:columns-3 lg:px-8">
          {gallery.map((item, i) => (
            <figure
              key={item.id || item.label}
              className="group relative mb-5 break-inside-avoid overflow-hidden rounded-xl border border-border shadow-sm transition hover:shadow-md"
            >
              <img
                src={item.image}
                alt={item.label}
                loading="lazy"
                className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
                  i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"
                }`}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-5 text-white backdrop-blur-[2px]">
                <p className="font-display text-lg font-bold">{item.label}</p>
                {item.category && <span className="text-xs text-white/70">{item.category}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}

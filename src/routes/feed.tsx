import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag, CheckCircle2, Phone } from "lucide-react";
import { useState } from "react";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { OrderModal } from "@/components/OrderModal";
import { useFarmData, type ProductItem } from "@/lib/store";
import { images } from "@/lib/site-data";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "ফিড, মাছ ও পণ্য — খামার বাড়ি" },
      { name: "description", content: "মুরগি, মাছ ও খামারের জন্য প্রয়োজনীয় নির্বাচিত ফিড, জীবন্ত মাছ ও মুরগি অর্ডার করুন।" },
      { property: "og:title", content: "ফিড ও পণ্য তালিকা — খামার বাড়ি" },
      { property: "og:description", content: "খামারের প্রয়োজন অনুযায়ী মানসম্মত মুরগি ও মাছের ফিড সরাসরি অর্ডার করুন।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  const { products, settings } = useFarmData();
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOrderClick = (product: ProductItem) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  return (
    <>
      <PageIntro
        eyebrow="ফিড ও পণ্য সামগ্রী"
        title="সঠিক খাদ্য, সুশৃঙ্খল খামার"
        description="মুরগি ও মাছের খামারের জন্য প্রয়োজনীয় মানসম্মত ফিড এবং আমাদের খামারের তাজা পণ্য সহজেই অনলাইনে অর্ডার করুন।"
        image={images.feedImage}
      />

      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <SectionHeading
              eyebrow="পণ্য তালিকা"
              title="খামারের প্রয়োজনীয় খাদ্য ও পণ্য"
              description="পছন্দের পণ্যের নিচে 'অর্ডার করুন' বাটনে ক্লিক করে সহজে ডেলিভারি নিন।"
            />
            <div className="rounded-lg bg-secondary/80 p-3 text-xs text-muted-foreground flex items-center gap-2">
              <Phone className="size-4 text-primary shrink-0" />
              <span>সরাসরি ফোনে অর্ডার করতে কল করুন: <strong className="text-foreground">{settings.phone}</strong></span>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article
                key={p.id}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <img src={p.image} alt={p.name} loading="lazy" className="size-full object-cover" />
                    <span className="absolute top-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {p.categoryLabel}
                    </span>
                    <span
                      className={`absolute top-3 right-3 rounded-md px-2.5 py-1 text-xs font-bold ${
                        p.inStock ? "bg-emerald-600 text-white" : "bg-destructive text-white"
                      }`}
                    >
                      {p.inStock ? "স্টকে আছে" : "স্টক শেষ"}
                    </span>
                  </div>

                  <div className="p-6">
                    <h2 className="font-display text-2xl font-bold text-foreground">{p.name}</h2>
                    <p className="mt-2.5 text-sm leading-6 text-muted-foreground">{p.description}</p>
                    
                    <div className="mt-4 flex items-baseline gap-1 text-primary">
                      <span className="font-display text-2xl font-bold">{p.price ? `${p.price} ৳` : "আলোচনা সাপেক্ষে"}</span>
                      {p.unit && <span className="text-xs text-muted-foreground">/ {p.unit}</span>}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-2.5">
                  <Button
                    onClick={() => handleOrderClick(p)}
                    disabled={!p.inStock}
                    size="lg"
                    className="w-full gap-2 font-bold shadow-sm"
                  >
                    <ShoppingBag className="size-4" />
                    {p.inStock ? "অর্ডার করুন" : "স্টক খালি"}
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/contact">
                      বিস্তারিত জানতে বার্তা দিন <ArrowRight className="size-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Order Modal Component */}
      <OrderModal
        product={selectedProduct}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </>
  );
}

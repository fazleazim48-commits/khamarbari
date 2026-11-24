import React, { useState } from "react";
import { CheckCircle2, ShoppingBag, Truck, X } from "lucide-react";
import { Button } from "./ui/button";
import { farmStore, type ProductItem } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";

interface OrderModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const { user } = useAuth();
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  if (!isOpen || !product) return null;

  const priceNum = parseInt(product.price.replace(/[^0-9]/g, ""), 10) || 0;
  const totalPrice = priceNum > 0 ? (priceNum * quantity).toLocaleString("bn-BD") : "আলোচনা সাপেক্ষে";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      alert("দয়া করে নাম, ফোন নম্বর এবং সম্পূর্ণ ঠিকানা পূরণ করুন।");
      return;
    }

    const newOrder = farmStore.createOrder({
      customerName,
      phone,
      address,
      productId: product.id,
      productName: product.name,
      quantity,
      unit: product.unit,
      pricePerUnit: product.price,
      notes,
    });

    setConfirmedOrderId(newOrder.id);
    setIsSuccess(true);
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card p-6 shadow-2xl md:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="বন্ধ করুন"
        >
          <X className="size-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-10" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-foreground">অর্ডার সফল হয়েছে!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              আপনার অর্ডার আইডি: <strong className="text-primary font-mono text-base">{confirmedOrderId}</strong>
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              আমাদের প্রতিনিধি শীঘ্রই আপনার দেওয়া নম্বরে কল করে অর্ডারটি নিশ্চিত করবেন এবং ডেলিভারি সম্পন্ন করবেন।
            </p>
            <div className="mt-6 rounded-lg bg-secondary p-4 text-left text-sm">
              <p className="font-semibold text-foreground">অর্ডারের বিবরণ:</p>
              <p className="mt-1 text-muted-foreground">পণ্য: {product.name}</p>
              <p className="text-muted-foreground">পরিমাণ: {quantity} ({product.unit})</p>
              <p className="text-muted-foreground font-semibold">আনুমানিক মূল্য: {totalPrice} ৳</p>
            </div>
            <Button onClick={handleDone} className="mt-6 w-full" size="lg">
              ঠিক আছে
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <ShoppingBag className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">পণ্য অর্ডার ফরম</h2>
                <p className="text-xs text-muted-foreground">ক্যাশ অন ডেলিভারি — পণ্য পেয়ে মূল্য পরিশোধ করুন</p>
              </div>
            </div>

            <div className="my-4 flex items-center gap-4 rounded-lg bg-secondary/80 p-3">
              <img
                src={product.image}
                alt={product.name}
                className="size-16 rounded-md object-cover border border-border"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm truncate">{product.name}</h4>
                <p className="text-xs text-muted-foreground">একক: {product.unit}</p>
                <p className="text-sm font-bold text-primary">
                  {product.price ? `${product.price} ৳ / ${product.unit}` : "মূল্য জানতে কল করুন"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-semibold text-foreground">
                  <span>আপনার নাম *</span>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="যেমন: মো: করিম"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </label>

                <label className="grid gap-1.5 text-xs font-semibold text-foreground">
                  <span>মোবাইল নম্বর *</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="যেমন: 018XXXXXXXX"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 items-center">
                <label className="grid gap-1.5 text-xs font-semibold text-foreground">
                  <span>পরিমাণ ({product.unit}) *</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="size-10 rounded-md border border-border bg-secondary font-bold text-foreground hover:bg-muted"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="h-10 w-20 text-center font-bold rounded-md border border-input bg-background text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="size-10 rounded-md border border-border bg-secondary font-bold text-foreground hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </label>

                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-right">
                  <span className="text-xs text-muted-foreground block">মোট আনুমানিক মূল্য</span>
                  <span className="font-display text-xl font-bold text-primary">{totalPrice} ৳</span>
                </div>
              </div>

              <label className="grid gap-1.5 text-xs font-semibold text-foreground">
                <span>সম্পূর্ণ ডেলিভারি ঠিকানা *</span>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="গ্রাম/রোড, থানা, জেলা (যেমন: শোফুরা, লক্ষণপুর, মনোহরগঞ্জ, কুমিল্লা)"
                  className="rounded-md border border-input bg-background p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-semibold text-foreground">
                <span>বিশেষ নোট / নির্দেশনা (ঐচ্ছিক)</span>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="যেমন: সকালের দিকে ফোন দিলে ভালো হয়"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <Truck className="size-4 text-primary" />
                <span>অর্ডার নিশ্চিতকরণের পর আমাদের নিজস্ব পরিবহনে ডেলিভারি দেওয়া হবে।</span>
              </div>

              <div className="mt-5 flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  বাতিল
                </Button>
                <Button type="submit" className="flex-1">
                  অর্ডার নিশ্চিত করুন
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

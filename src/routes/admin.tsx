import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Package,
  ShoppingBag,
  Video,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LayoutDashboard,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ExternalLink,
  LogOut,
  Upload,
  Phone,
  AlertCircle,
  Eye,
  ShieldCheck,
  Save,
  Film,
  Database,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { farmStore, useFarmData, type ProductItem, type OrderItem, type GalleryItem } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { saveVideoBlob, getVideoBlob, deleteVideoBlob } from "@/lib/video-db";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "অ্যাডমিন ড্যাশবোর্ড — খামার বাড়ি" },
      { name: "description", content: "খামার বাড়ি অ্যাডমিন কন্ট্রোল প্যানেল।" },
    ],
  }),
  component: AdminDashboard,
});

type AdminTab = "overview" | "orders" | "products" | "media" | "gallery" | "messages" | "settings";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin, logout, login } = useAuth();
  const data = useFarmData();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [toastMsg, setToastMsg] = useState<string>("");

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState<ProductItem["category"]>("poultry_feed");
  const [prodPrice, setProdPrice] = useState("");
  const [prodUnit, setProdUnit] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodInStock, setProdInStock] = useState(true);

  // Gallery Add State
  const [galLabel, setGalLabel] = useState("");
  const [galCategory, setGalCategory] = useState("খামারের দৃশ্য");
  const [galImage, setGalImage] = useState("");

  // Media / Video State
  const [videoUrl, setVideoUrl] = useState(data.settings.videoUrl);
  const [videoTitle, setVideoTitle] = useState(data.settings.videoTitle);
  const [videoDesc, setVideoDesc] = useState(data.settings.videoDescription);
  const [videoUploadMode, setVideoUploadMode] = useState<"upload" | "url">(
    data.settings.videoUrl?.startsWith("indexeddb:") ? "upload" : "upload"
  );
  const [uploadedVideoBlobUrl, setUploadedVideoBlobUrl] = useState<string | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    let url: string | null = null;
    if (data.settings.videoUrl?.startsWith("indexeddb:")) {
      const key = data.settings.videoUrl.replace("indexeddb:", "");
      getVideoBlob(key).then((blob) => {
        if (active && blob) {
          url = URL.createObjectURL(blob);
          setUploadedVideoBlobUrl(url);
        }
      });
    }
    return () => {
      active = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [data.settings.videoUrl]);

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    name: data.settings.name,
    tagline: data.settings.tagline,
    owner: data.settings.owner,
    phone: data.settings.phone,
    email: data.settings.email,
    address: data.settings.address,
  });

  const productFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // MongoDB Status State
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    dbName: string;
    message: string;
    counts?: { products: number; orders: number; messages: number };
  } | null>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);
  const [isSyncingDb, setIsSyncingDb] = useState(false);

  const checkDatabase = async () => {
    setIsCheckingDb(true);
    try {
      const res = await farmStore.checkDatabaseStatus();
      setDbStatus(res);
    } catch (err: any) {
      setDbStatus({
        connected: false,
        dbName: "khamarbari",
        message: err?.message || "সার্ভার সংযোগ করা যায়নি",
      });
    } finally {
      setIsCheckingDb(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      checkDatabase();
    }
  }, [isAdmin]);

  const handleSyncAllToMongo = async () => {
    setIsSyncingDb(true);
    try {
      const res = await farmStore.pushAllToMongo();
      if (res.success) {
        showToast("সব তথ্য MongoDB তে সফলভাবে সিঙ্ক হয়েছে!");
        await checkDatabase();
      } else {
        showToast(res.message || "সিঙ্ক করতে ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      showToast("ত্রুটি: " + (err?.message || "সিঙ্ক ব্যর্থ"));
    } finally {
      setIsSyncingDb(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Helper to handle image uploads to Base64
  const handleImageFile = (file: File, setter: (val: string) => void) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("ছবিটির সাইজ ৫MB এর কম হতে হবে।");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Authentication Guard
  if (!isAdmin) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-secondary/40 px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-2xl">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-destructive/10 text-destructive">
            <XCircle className="size-8" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground">অ্যাডমিন প্রবেশাধিকার প্রয়োজন</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            এই ড্যাশবোর্ডটি শুধু খামার বাড়ি অ্যাডমিনের জন্য সংরক্ষিত। দয়া করে সঠিক অ্যাডমিন তথ্য দিয়ে লগইন করুন।
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Button asChild size="lg" className="w-full font-bold">
              <Link to="/login">অ্যাডমিন লগইন করুন</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">মূল ওয়েবসাইটে ফিরে যান</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Handlers ---
  const handleOpenProductModal = (product?: ProductItem) => {
    if (product) {
      setEditingProduct(product);
      setProdName(product.name);
      setProdCategory(product.category);
      setProdPrice(product.price);
      setProdUnit(product.unit);
      setProdDesc(product.description);
      setProdImage(product.image);
      setProdInStock(product.inStock);
    } else {
      setEditingProduct(null);
      setProdName("");
      setProdCategory("poultry_feed");
      setProdPrice("");
      setProdUnit("বস্তা / কেজি");
      setProdDesc("");
      setProdImage("");
      setProdInStock(true);
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName) {
      alert("পণ্যের নাম আবশ্যক");
      return;
    }

    const categoryLabels: Record<ProductItem["category"], string> = {
      poultry_feed: "মুরগির ফিড",
      fish_feed: "মাছের ফিড",
      livestock: "জীবন্ত মাছ ও মুরগি",
      other: "অন্যান্য খাদ্য ও সরঞ্জাম",
    };

    farmStore.saveProduct({
      id: editingProduct?.id,
      name: prodName,
      category: prodCategory,
      categoryLabel: categoryLabels[prodCategory],
      price: prodPrice,
      unit: prodUnit || "একক",
      description: prodDesc,
      image: prodImage || data.products[0]?.image || "",
      inStock: prodInStock,
    });

    setIsProductModalOpen(false);
    showToast(editingProduct ? "পণ্য সফলভাবে আপডেট হয়েছে!" : "নতুন পণ্য যুক্ত হয়েছে!");
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${name}" পণ্যটি মুছে ফেলতে চান?`)) {
      farmStore.deleteProduct(id);
      showToast("পণ্য মুছে ফেলা হয়েছে।");
    }
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galImage) {
      alert("দয়া করে একটি ছবি আপলোড করুন বা লিংক দিন।");
      return;
    }
    farmStore.addGalleryItem({
      label: galLabel || "খামার বাড়ির দৃশ্য",
      category: galCategory || "খামার",
      image: galImage,
    });
    setGalLabel("");
    setGalImage("");
    showToast("গ্যালারিতে নতুন ছবি যুক্ত হয়েছে!");
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    farmStore.updateSettings({
      videoUrl,
      videoTitle,
      videoDescription: videoDesc,
    });
    showToast("ভিডিও ও মিডিয়া সেটিংস সংরক্ষিত হয়েছে!");
  };

  const handleDirectVideoUpload = async (file: File) => {
    if (file.size > 200 * 1024 * 1024) {
      alert("ভিডিও ফাইলের সাইজ ২০০ MB এর কম হতে হবে।");
      return;
    }
    setIsUploadingVideo(true);
    try {
      await saveVideoBlob("main_farm_video", file);
      const objUrl = URL.createObjectURL(file);
      setUploadedVideoBlobUrl(objUrl);
      setVideoUrl("indexeddb:main_farm_video");
      farmStore.updateSettings({
        videoUrl: "indexeddb:main_farm_video",
        videoTitle: videoTitle || file.name.replace(/\.[^/.]+$/, ""),
        videoDescription: videoDesc,
      });
      showToast("ভিডিও সরাসরি আপলোড সম্পন্ন হয়েছে!");
    } catch (err) {
      console.error(err);
      alert("ভিডিও আপলোড করতে সমস্যা হয়েছে।");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleDeleteUploadedVideo = async () => {
    if (confirm("আপনি কি নিশ্চিত যে আপলোড করা ভিডিওটি মুছে ফেলতে চান?")) {
      await deleteVideoBlob("main_farm_video");
      setUploadedVideoBlobUrl(null);
      setVideoUrl("");
      farmStore.updateSettings({ videoUrl: "" });
      showToast("ভিডিও মুছে ফেলা হয়েছে।");
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    farmStore.updateSettings(settingsForm);
    showToast("খামার তথ্য সফলভাবে আপডেট হয়েছে!");
  };

  // Filtered orders
  const filteredOrders = data.orders.filter((order) => {
    if (orderFilter === "all") return true;
    return order.status === orderFilter;
  });

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="হোমপেজ">
              <BrandLogo />
            </Link>
            <span className="hidden sm:inline-block rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
              অ্যাডমিন প্যানেল
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {dbStatus && (
              <div
                className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                  dbStatus.connected
                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                }`}
                title={dbStatus.message}
              >
                <span
                  className={`size-2 rounded-full ${
                    dbStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                <span>{dbStatus.connected ? "MongoDB সংযুক্ত" : "লোকাল ব্যাকআপ মোড"}</span>
              </div>
            )}
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex text-xs">
              <Link to="/" target="_blank">
                <ExternalLink className="size-3.5 mr-1" /> সাইট প্রিভিউ
              </Link>
            </Button>
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <span className="hidden md:inline-block text-xs font-semibold text-foreground">
                {user?.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                className="text-xs text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-4 sm:mr-1" />
                <span className="hidden sm:inline">লগআউট</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="border-t border-border bg-card overflow-x-auto scrollbar-none">
          <div className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6 lg:px-8 py-1.5">
            {[
              { id: "overview", label: "ওভারভিউ", icon: LayoutDashboard },
              { id: "orders", label: `অর্ডারসমূহ (${data.orders.length})`, icon: ShoppingBag },
              { id: "products", label: `পণ্য তালিকা (${data.products.length})`, icon: Package },
              { id: "media", label: "ভিডিও ও ব্যানার", icon: Video },
              { id: "gallery", label: `গ্যালারি (${data.gallery.length})`, icon: ImageIcon },
              { id: "messages", label: `বার্তা (${data.messages.length})`, icon: MessageSquare },
              { id: "settings", label: "খামার তথ্য", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ================= 1. OVERVIEW TAB ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">মোট অর্ডার</span>
                  <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <ShoppingBag className="size-5" />
                  </div>
                </div>
                <h3 className="mt-3 font-display text-3xl font-bold text-foreground">
                  {data.orders.length.toLocaleString("bn-BD")}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">গ্রাহকদের মোট প্লেস করা অর্ডার</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">অপেক্ষমাণ অর্ডার</span>
                  <div className="grid size-10 place-items-center rounded-lg bg-amber-500/10 text-amber-600">
                    <Clock className="size-5" />
                  </div>
                </div>
                <h3 className="mt-3 font-display text-3xl font-bold text-amber-600">
                  {data.orders.filter((o) => o.status === "pending").length.toLocaleString("bn-BD")}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">দ্রুত ডেলিভারি নিশ্চিত করতে হবে</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">মোট সক্রিয় পণ্য</span>
                  <div className="grid size-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Package className="size-5" />
                  </div>
                </div>
                <h3 className="mt-3 font-display text-3xl font-bold text-foreground">
                  {data.products.length.toLocaleString("bn-BD")}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">ফিড, মাছ ও মুরগির আইটেম</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">যোগাযোগ বার্তা</span>
                  <div className="grid size-10 place-items-center rounded-lg bg-blue-500/10 text-blue-600">
                    <MessageSquare className="size-5" />
                  </div>
                </div>
                <h3 className="mt-3 font-display text-3xl font-bold text-foreground">
                  {data.messages.length.toLocaleString("bn-BD")}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">ওয়েবসাইট ফরম থেকে প্রাপ্ত বার্তা</p>
              </div>
            </div>

            {/* MongoDB Database Status & Sync Banner */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`grid size-12 shrink-0 place-items-center rounded-xl ${
                      dbStatus?.connected
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    <Database className="size-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">ক্লাউড ডাটাবেজ (MongoDB) স্থিতি</h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          dbStatus?.connected
                            ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            dbStatus?.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                          }`}
                        />
                        {dbStatus?.connected
                          ? `সংযুক্ত (Database: ${dbStatus.dbName})`
                          : "লোকাল ব্যাকআপ মোড (Local Storage)"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {dbStatus?.connected
                        ? `MongoDB Atlas সফলভাবে কানেক্টেড। পণ্য (${dbStatus.counts?.products ?? data.products.length}), অর্ডার (${dbStatus.counts?.orders ?? data.orders.length}), ও বার্তা (${dbStatus.counts?.messages ?? data.messages.length}) ক্লাউডে সরাসরি সংরক্ষণ হচ্ছে।`
                        : "বর্তমানে ব্রাউজারের লোকাল স্টোরেজে তথ্য সংরক্ষিত হচ্ছে। Vercel বা .env ফাইলে MONGODB_URI যুক্ত করলেই সরাসরি ক্লাউড ডাটাবেজে পার্মানেন্ট ব্যাকআপ চালু হয়ে যাবে।"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkDatabase}
                    disabled={isCheckingDb}
                    className="text-xs"
                  >
                    <RefreshCw className={`size-3.5 mr-1.5 ${isCheckingDb ? "animate-spin" : ""}`} />
                    রিফ্রেশ
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSyncAllToMongo}
                    disabled={isSyncingDb}
                    className="text-xs"
                  >
                    <Database className="size-3.5 mr-1.5" />
                    {isSyncingDb ? "সিঙ্ক হচ্ছে..." : "MongoDB তে সিঙ্ক করুন"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Recent Orders */}
              <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h3 className="font-display text-lg font-bold text-foreground">সাম্প্রতিক অর্ডারসমূহ</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")} className="text-xs text-primary font-bold">
                    সব অর্ডার দেখুন
                  </Button>
                </div>
                <div className="mt-4 divide-y divide-border">
                  {data.orders.slice(0, 4).map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary">{order.id}</span>
                          <span className="font-semibold text-sm text-foreground">{order.customerName}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              order.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : order.status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {order.statusLabel}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {order.productName} — {order.quantity} {order.unit} ({order.totalPriceText})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${order.phone}`}
                          className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground"
                        >
                          <Phone className="size-3" /> {order.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                  {data.orders.length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">কোনো অর্ডার পাওয়া যায়নি।</p>
                  )}
                </div>
              </div>

              {/* Quick Admin Actions */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                <h3 className="font-display text-lg font-bold text-foreground border-b border-border pb-4">
                  কুইক অ্যাকশন
                </h3>
                <div className="flex flex-col gap-2.5">
                  <Button
                    onClick={() => {
                      setActiveTab("products");
                      handleOpenProductModal();
                    }}
                    className="w-full justify-start gap-2"
                  >
                    <Plus className="size-4" /> নতুন পণ্য যোগ করুন
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("media")}
                    className="w-full justify-start gap-2"
                  >
                    <Video className="size-4" /> খামারের ভিডিও পরিবর্তন করুন
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("gallery")}
                    className="w-full justify-start gap-2"
                  >
                    <ImageIcon className="size-4" /> নতুন খামার ছবি আপলোড করুন
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("settings")}
                    className="w-full justify-start gap-2"
                  >
                    <Settings className="size-4" /> ফোন ও ঠিকানা আপডেট
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. ORDERS TAB ================= */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">অর্ডার ব্যবস্থাপনা</h2>
                <p className="text-sm text-muted-foreground">গ্রাহকদের দেওয়া অর্ডার পর্যালোচনা ও ডেলিভারি নিয়ন্ত্রণ করুন</p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-card p-1">
                {[
                  { id: "all", label: "সব" },
                  { id: "pending", label: "অপেক্ষমাণ" },
                  { id: "confirmed", label: "নিশ্চিত" },
                  { id: "delivered", label: "ডেলিভার্ড" },
                  { id: "cancelled", label: "বাতিল" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOrderFilter(f.id)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                      orderFilter === f.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-secondary/50 text-xs font-bold text-foreground">
                    <tr>
                      <th className="px-4 py-3.5">অর্ডার আইডি</th>
                      <th className="px-4 py-3.5">গ্রাহক ও ফোন</th>
                      <th className="px-4 py-3.5">পণ্য ও পরিমাণ</th>
                      <th className="px-4 py-3.5">ঠিকানা</th>
                      <th className="px-4 py-3.5">মোট মূল্য</th>
                      <th className="px-4 py-3.5">স্ট্যাটাস</th>
                      <th className="px-4 py-3.5 text-right">পদক্ষেপ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-secondary/20 transition">
                        <td className="px-4 py-4 font-mono font-bold text-xs text-primary">{order.id}</td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-foreground">{order.customerName}</div>
                          <a href={`tel:${order.phone}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                            <Phone className="size-3" /> {order.phone}
                          </a>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-foreground">{order.productName}</div>
                          <div className="text-xs text-muted-foreground">
                            {order.quantity} {order.unit}
                          </div>
                        </td>
                        <td className="px-4 py-4 max-w-xs text-xs text-muted-foreground">
                          {order.address}
                          {order.notes && <div className="mt-1 text-[11px] text-amber-700 italic">নোট: {order.notes}</div>}
                        </td>
                        <td className="px-4 py-4 font-display font-bold text-foreground">{order.totalPriceText}</td>
                        <td className="px-4 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => {
                              farmStore.updateOrderStatus(order.id, e.target.value as OrderItem["status"]);
                              showToast(`অর্ডার ${order.id} স্ট্যাটাস পরিবর্তন হয়েছে`);
                            }}
                            className={`h-8 rounded-md px-2 text-xs font-bold border border-input bg-background outline-none ${
                              order.status === "pending"
                                ? "text-amber-700 font-bold"
                                : order.status === "confirmed"
                                ? "text-blue-700 font-bold"
                                : order.status === "delivered"
                                ? "text-emerald-700 font-bold"
                                : "text-destructive font-bold"
                            }`}
                          >
                            <option value="pending">অপেক্ষমাণ (Pending)</option>
                            <option value="confirmed">নিশ্চিত (Confirmed)</option>
                            <option value="delivered">ডেলিভার্ড (Delivered)</option>
                            <option value="cancelled">বাতিল (Cancelled)</option>
                          </select>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm("আপনি কি নিশ্চিত যে এই অর্ডারটি মুছে ফেলতে চান?")) {
                                farmStore.deleteOrder(order.id);
                                showToast("অর্ডার মুছে ফেলা হয়েছে।");
                              }
                            }}
                            className="size-8 text-destructive hover:bg-destructive/10"
                            aria-label="মুছে ফেলুন"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredOrders.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <ShoppingBag className="mx-auto size-12 opacity-30 mb-2" />
                  <p>এই ফিল্টারে কোনো অর্ডার পাওয়া যায়নি।</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 3. PRODUCTS TAB ================= */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">পণ্য ব্যবস্থাপনা</h2>
                <p className="text-sm text-muted-foreground">খামারের ফিড, মুরগি ও মাছের পণ্য যোগ, এডিট ও পরিবর্তন করুন</p>
              </div>
              <Button onClick={() => handleOpenProductModal()} className="gap-2 font-bold shadow-md">
                <Plus className="size-4" /> নতুন পণ্য যোগ করুন
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.products.map((p) => (
                <div key={p.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                      <img src={p.image} alt={p.name} className="size-full object-cover" />
                      <span className="absolute top-3 left-3 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
                        {p.categoryLabel}
                      </span>
                      <span
                        className={`absolute top-3 right-3 rounded-md px-2 py-0.5 text-xs font-bold ${
                          p.inStock ? "bg-emerald-600 text-white" : "bg-destructive text-white"
                        }`}
                      >
                        {p.inStock ? "স্টকে আছে" : "স্টক শেষ"}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="font-display text-lg font-bold text-foreground">{p.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                      <div className="mt-3 flex items-baseline gap-1 text-primary">
                        <span className="font-display text-2xl font-bold">{p.price || "আলোচনা"}</span>
                        <span className="text-xs text-muted-foreground font-semibold">৳ / {p.unit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border bg-secondary/30 p-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenProductModal(p)}
                      className="flex-1 gap-1.5 text-xs font-semibold"
                    >
                      <Edit2 className="size-3.5" /> এডিট
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="text-destructive hover:bg-destructive/10 text-xs"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. MEDIA & VIDEO TAB ================= */}
        {activeTab === "media" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">ভিডিও ও ব্যানার মিডিয়া</h2>
              <p className="text-sm text-muted-foreground">
                কম্পিউটার থেকে সরাসরি ভিডিও ফাইল আপলোড করুন অথবা ইউটিউব ভিডিও লিংক যুক্ত করুন
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Video Editor */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
                  <Video className="size-5 text-primary" /> খামারের প্রধান ভিডিও সেটআপ
                </h3>

                {/* Mode Selector */}
                <div className="mt-4 flex gap-2 rounded-lg bg-secondary p-1">
                  <button
                    type="button"
                    onClick={() => setVideoUploadMode("upload")}
                    className={`flex-1 rounded-md py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      videoUploadMode === "upload"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Upload className="size-3.5" /> কম্পিউটার থেকে সরাসরি আপলোড
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoUploadMode("url")}
                    className={`flex-1 rounded-md py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      videoUploadMode === "url"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ExternalLink className="size-3.5" /> ইউটিউব / অনলাইন লিংক
                  </button>
                </div>

                {/* Direct Upload Section */}
                {videoUploadMode === "upload" && (
                  <div className="mt-5 space-y-4">
                    <input
                      type="file"
                      ref={videoFileInputRef}
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleDirectVideoUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    {videoUrl?.startsWith("indexeddb:") ? (
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                        <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/20 text-emerald-700">
                          <CheckCircle2 className="size-6" />
                        </div>
                        <h4 className="mt-2.5 font-bold text-sm text-foreground">
                          ভিডিও সরাসরি সফলভাবে আপলোড করা আছে
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          আপনার কম্পিউটার থেকে আপলোড করা ভিডিওটি সংরক্ষিত রয়েছে।
                        </p>
                        <div className="mt-4 flex justify-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isUploadingVideo}
                            onClick={() => videoFileInputRef.current?.click()}
                            className="text-xs font-semibold gap-1.5"
                          >
                            <Upload className="size-3.5" /> নতুন ভিডিও দিয়ে পরিবর্তন করুন
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteUploadedVideo}
                            className="text-xs text-destructive hover:bg-destructive/10 gap-1.5"
                          >
                            <Trash2 className="size-3.5" /> মুছে ফেলুন
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => videoFileInputRef.current?.click()}
                        className="cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center transition hover:border-primary hover:bg-primary/10"
                      >
                        <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                          <Upload className="size-6" />
                        </div>
                        <h4 className="mt-3 font-bold text-sm text-foreground">
                          {isUploadingVideo ? "ভিডিও সেভ হচ্ছে... একটু অপেক্ষা করুন" : "কম্পিউটার থেকে ভিডিও ফাইল আপলোড করুন"}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          MP4, WebM, MOV ফাইল নির্বাচন করুন (সর্বোচ্চ ২০০ MB)
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          disabled={isUploadingVideo}
                          className="mt-4 font-bold gap-1.5"
                        >
                          <Upload className="size-3.5" />{" "}
                          {isUploadingVideo ? "আপলোড হচ্ছে..." : "ভিডিও ফাইল ব্রাউজ করুন"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Online/YouTube Link Section */}
                {videoUploadMode === "url" && (
                  <div className="mt-5 space-y-4">
                    <label className="block text-xs font-semibold text-foreground">
                      <span>ভিডিও লিংক (YouTube বা Direct Video URL)</span>
                      <input
                        type="text"
                        value={videoUrl?.startsWith("indexeddb:") ? "" : videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <span className="mt-1 block text-[11px] text-muted-foreground">
                        ইউটিউব ভিডিওর সম্পূর্ণ লিংক অথবা অনলাইন ভিডিওর সরাসরি URL দিন।
                      </span>
                    </label>
                  </div>
                )}

                {/* Common Title & Description */}
                <form onSubmit={handleSaveMedia} className="mt-4 space-y-4 border-t border-border pt-4">
                  <label className="block text-xs font-semibold text-foreground">
                    <span>ভিডিওর শিরোনাম</span>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="খামার বাড়ির কার্যক্রম দেখুন"
                      className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-foreground">
                    <span>ভিডিওর বিবরণ</span>
                    <textarea
                      rows={3}
                      value={videoDesc}
                      onChange={(e) => setVideoDesc(e.target.value)}
                      placeholder="ভিডিও সম্পর্কে সংক্ষিপ্ত বিবরণ লিখুন..."
                      className="mt-1.5 w-full rounded-lg border border-input bg-background p-2.5 text-sm outline-none focus:border-primary"
                    />
                  </label>

                  <Button type="submit" className="gap-2 font-bold">
                    <Save className="size-4" /> শিরোনাম ও বিবরণ সংরক্ষণ করুন
                  </Button>
                </form>
              </div>

              {/* Live Preview */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
                    <Eye className="size-4 text-primary" /> ভিডিও লাইভ প্রিভিউ
                  </h3>

                  <div className="mt-4 aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center border border-border">
                    {videoUrl?.startsWith("indexeddb:") ? (
                      uploadedVideoBlobUrl ? (
                        <video
                          src={uploadedVideoBlobUrl}
                          controls
                          className="size-full object-contain"
                        />
                      ) : (
                        <p className="text-white/70 text-xs">ভিডিও ফাইল লোড হচ্ছে...</p>
                      )
                    ) : videoUrl ? (
                      <iframe
                        src={
                          videoUrl.includes("watch?v=")
                            ? `https://www.youtube.com/embed/${videoUrl.split("watch?v=")[1]?.split("&")[0]}`
                            : videoUrl.includes("youtu.be/")
                            ? `https://www.youtube.com/embed/${videoUrl.split("youtu.be/")[1]?.split("?")[0]}`
                            : videoUrl
                        }
                        title={videoTitle}
                        className="size-full border-0"
                        allowFullScreen
                      />
                    ) : (
                      <p className="text-white/70 text-xs">ভিডিও আপলোড করলে বা লিংক দিলে এখানে প্রিভিউ দেখতে পাবেন</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-secondary p-3 text-xs text-muted-foreground flex items-center gap-2">
                  <Film className="size-4 text-primary shrink-0" />
                  <span>
                    হোমপেজে যে কেউ প্লে বাটনে ক্লিক করলে এই ভিডিওটি সম্পূর্ণ পর্দায় চালু হবে।
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. GALLERY TAB ================= */}
        {activeTab === "gallery" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">গ্যালারি ম্যানেজমেন্ট</h2>
                <p className="text-sm text-muted-foreground">খামারের নতুন ছবি যুক্ত করুন অথবা আগের ছবি মুছে ফেলুন</p>
              </div>
            </div>

            {/* Add Photo Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Plus className="size-4 text-primary" /> নতুন ছবি আপলোড করুন
              </h3>
              <form onSubmit={handleAddGallery} className="grid gap-4 sm:grid-cols-3 items-end">
                <label className="text-xs font-semibold text-foreground">
                  <span>ছবির নাম/ক্যাপশন *</span>
                  <input
                    type="text"
                    required
                    value={galLabel}
                    onChange={(e) => setGalLabel(e.target.value)}
                    placeholder="যেমন: নতুন মুরগির শেড"
                    className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                  />
                </label>

                <label className="text-xs font-semibold text-foreground">
                  <span>ক্যাটাগরি</span>
                  <input
                    type="text"
                    value={galCategory}
                    onChange={(e) => setGalCategory(e.target.value)}
                    placeholder="যেমন: মুরগি চাষ / মাছ চাষ"
                    className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                  />
                </label>

                <div>
                  <span className="block text-xs font-semibold text-foreground mb-1.5">কম্পিউটার থেকে ছবি সিলেক্ট করুন *</span>
                  <input
                    type="file"
                    ref={galleryFileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageFile(e.target.files[0], setGalImage);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="flex-1 gap-1.5 text-xs"
                    >
                      <Upload className="size-3.5" /> {galImage ? "ছবি সিলেক্টেড ✓" : "ছবি ব্রাউজ করুন"}
                    </Button>
                    <Button type="submit" className="font-bold">
                      আপলোড
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {/* Gallery Photos Grid */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.gallery.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <img src={item.image} alt={item.label} className="aspect-[4/3] w-full object-cover" />
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-foreground truncate">{item.label}</h4>
                    <span className="text-[11px] text-muted-foreground">{item.category}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`"${item.label}" ছবিটি মুছে ফেলতে চান?`)) {
                        farmStore.deleteGalleryItem(item.id);
                        showToast("ছবি মুছে ফেলা হয়েছে।");
                      }
                    }}
                    className="absolute top-2 right-2 rounded-full bg-destructive/90 p-1.5 text-white shadow-md opacity-90 hover:opacity-100"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 6. MESSAGES TAB ================= */}
        {activeTab === "messages" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">গ্রাহকদের বার্তা</h2>
              <p className="text-sm text-muted-foreground">যোগাযোগ পেজ থেকে পাঠানো মেসেজগুলো পর্যালোচনা করুন</p>
            </div>

            <div className="divide-y divide-border rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              {data.messages.map((msg) => (
                <div key={msg.id} className={`p-5 transition ${msg.isRead ? "bg-card" : "bg-primary/5"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base text-foreground">{msg.name}</span>
                      <span className="text-xs text-muted-foreground">• {msg.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${msg.phone}`}
                        className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Phone className="size-3.5" /> কল করুন: {msg.phone}
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          farmStore.deleteMessage(msg.id);
                          showToast("বার্তা মুছে ফেলা হয়েছে।");
                        }}
                        className="size-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  {msg.subject && <p className="mt-1 text-xs font-bold text-primary">{msg.subject}</p>}
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{msg.message}</p>
                </div>
              ))}
              {data.messages.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <MessageSquare className="mx-auto size-12 opacity-30 mb-2" />
                  <p>বর্তমানে কোনো বার্তা জমা নেই।</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 7. SETTINGS TAB ================= */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">খামার তথ্য ও সেটিংস</h2>
              <p className="text-sm text-muted-foreground">ওয়েবসাইটে প্রদর্শিত ফোন নম্বর, ঠিকানা ও নাম আপডেট করুন</p>
            </div>

            <div className="max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm">
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <label className="block text-xs font-semibold text-foreground">
                  <span>খামারের নাম</span>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                  />
                </label>

                <label className="block text-xs font-semibold text-foreground">
                  <span>ট্যাগলাইন</span>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-foreground">
                    <span>পরিচালকের নাম</span>
                    <input
                      type="text"
                      value={settingsForm.owner}
                      onChange={(e) => setSettingsForm({ ...settingsForm, owner: e.target.value })}
                      className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                    />
                  </label>

                  <label className="block text-xs font-semibold text-foreground">
                    <span>প্রধান ফোন নম্বর</span>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                    />
                  </label>
                </div>

                <label className="block text-xs font-semibold text-foreground">
                  <span>সম্পূর্ণ ঠিকানা</span>
                  <textarea
                    rows={2}
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-sm outline-none"
                  />
                </label>

                <Button type="submit" size="lg" className="gap-2 font-bold mt-2">
                  <Save className="size-4" /> সেটিংস সংরক্ষণ করুন
                </Button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ================= PRODUCT ADD/EDIT MODAL ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-foreground border-b border-border pb-3">
              {editingProduct ? "পণ্য এডিট করুন" : "নতুন পণ্য যোগ করুন"}
            </h3>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4">
              <label className="block text-xs font-semibold text-foreground">
                <span>পণ্যের নাম *</span>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="যেমন: উন্নত ভাসমান ফিড"
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-foreground">
                  <span>ক্যাটাগরি</span>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ProductItem["category"])}
                    className="mt-1 h-10 w-full rounded-md border border-input bg-background px-2 text-sm outline-none"
                  >
                    <option value="poultry_feed">মুরগির ফিড</option>
                    <option value="fish_feed">মাছের ফিড</option>
                    <option value="livestock">জীবন্ত মাছ / মুরগি</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </label>

                <label className="block text-xs font-semibold text-foreground">
                  <span>মূল্য (টাকা)</span>
                  <input
                    type="text"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="যেমন: ২৫৫০"
                    className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-foreground">
                  <span>একক (Unit)</span>
                  <input
                    type="text"
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    placeholder="যেমন: ৫০ কেজি বস্তা / কেজি"
                    className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"
                  />
                </label>

                <label className="flex items-center gap-2 pt-6 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodInStock}
                    onChange={(e) => setProdInStock(e.target.checked)}
                    className="size-4 rounded border-input text-primary"
                  />
                  <span>বর্তমানে স্টকে আছে</span>
                </label>
              </div>

              <label className="block text-xs font-semibold text-foreground">
                <span>পণ্যের ছবি আপলোড</span>
                <input
                  type="file"
                  ref={productFileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageFile(e.target.files[0], setProdImage);
                    }
                  }}
                  className="hidden"
                />
                <div className="mt-1 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => productFileInputRef.current?.click()}
                    className="flex-1 gap-1.5 text-xs"
                  >
                    <Upload className="size-3.5" /> {prodImage ? "ছবি পরিবর্তন করুন" : "কম্পিউটার থেকে ছবি দিন"}
                  </Button>
                </div>
                {prodImage && (
                  <div className="mt-2 size-20 rounded-md overflow-hidden border border-border">
                    <img src={prodImage} alt="Preview" className="size-full object-cover" />
                  </div>
                )}
              </label>

              <label className="block text-xs font-semibold text-foreground">
                <span>পণ্যের বর্ণনা</span>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="পুষ্টিমান, গুণগত বৈশিষ্ট্য ইত্যাদি..."
                  className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-sm outline-none"
                />
              </label>

              <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>
                  বাতিল
                </Button>
                <Button type="submit" className="font-bold">
                  সংরক্ষণ করুন
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

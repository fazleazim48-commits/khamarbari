import { createServerFn } from "@tanstack/react-start";
import { getDatabase, isMongoConnected } from "./mongodb";
import type { ProductItem, OrderItem, GalleryItem, ContactMessage, SiteSettings } from "./store";

// Clean MongoDB documents to ensure plain JSON serialization (no ObjectId instances)
function sanitizeDoc<T>(doc: any): T {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: rest.id || (_id ? String(_id) : undefined),
  } as T;
}

// 1. Database Connection Status Check
export const checkDbStatusServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const status = await isMongoConnected();
  if (!status.connected) {
    return {
      connected: false,
      dbName: status.dbName,
      message: status.error || "MongoDB not connected. Running in local browser storage mode.",
      counts: { products: 0, orders: 0, messages: 0 },
    };
  }

  try {
    const db = await getDatabase();
    if (!db) throw new Error("Database handle not found");

    const [prodCount, orderCount, msgCount] = await Promise.all([
      db.collection("products").countDocuments(),
      db.collection("orders").countDocuments(),
      db.collection("messages").countDocuments(),
    ]);

    return {
      connected: true,
      dbName: status.dbName,
      message: `MongoDB connected (${status.dbName})`,
      counts: {
        products: prodCount,
        orders: orderCount,
        messages: msgCount,
      },
    };
  } catch (err: any) {
    return {
      connected: false,
      dbName: status.dbName,
      message: err?.message || "Failed to query MongoDB",
      counts: { products: 0, orders: 0, messages: 0 },
    };
  }
});

// 2. Products Server Functions
export const fetchProductsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = await getDatabase();
  if (!db) return null;

  try {
    const docs = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
    return docs.map((d) => sanitizeDoc<ProductItem>(d));
  } catch (error) {
    console.error("fetchProductsServerFn error:", error);
    return null;
  }
});

export const saveProductServerFn = createServerFn({ method: "POST" })
  .validator((product: ProductItem) => product)
  .handler(async ({ data }) => {
    const db = await getDatabase();
    if (!db) return { success: false, reason: "no_db" };

    try {
      await db.collection("products").updateOne(
        { id: data.id },
        { $set: data },
        { upsert: true }
      );
      return { success: true, product: data };
    } catch (error: any) {
      console.error("saveProductServerFn error:", error);
      return { success: false, error: error?.message };
    }
  });

export const deleteProductServerFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const db = await getDatabase();
    if (!db) return { success: false, reason: "no_db" };

    try {
      await db.collection("products").deleteOne({ id });
      return { success: true };
    } catch (error: any) {
      console.error("deleteProductServerFn error:", error);
      return { success: false, error: error?.message };
    }
  });

// 3. Orders Server Functions
export const fetchOrdersServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = await getDatabase();
  if (!db) return null;

  try {
    const docs = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();
    return docs.map((d) => sanitizeDoc<OrderItem>(d));
  } catch (error) {
    console.error("fetchOrdersServerFn error:", error);
    return null;
  }
});

export const createOrderServerFn = createServerFn({ method: "POST" })
  .validator((order: OrderItem) => order)
  .handler(async ({ data }) => {
    const db = await getDatabase();
    if (!db) return { success: false, reason: "no_db" };

    try {
      await db.collection("orders").updateOne(
        { id: data.id },
        { $set: data },
        { upsert: true }
      );
      return { success: true, order: data };
    } catch (error: any) {
      console.error("createOrderServerFn error:", error);
      return { success: false, error: error?.message };
    }
  });

export const updateOrderStatusServerFn = createServerFn({ method: "POST" })
  .validator((payload: { orderId: string; status: OrderItem["status"]; statusLabel: string }) => payload)
  .handler(async ({ data }) => {
    const db = await getDatabase();
    if (!db) return { success: false, reason: "no_db" };

    try {
      await db.collection("orders").updateOne(
        { id: data.orderId },
        { $set: { status: data.status, statusLabel: data.statusLabel } }
      );
      return { success: true };
    } catch (error: any) {
      console.error("updateOrderStatusServerFn error:", error);
      return { success: false, error: error?.message };
    }
  });

export const deleteOrderServerFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const db = await getDatabase();
    if (!db) return { success: false, reason: "no_db" };

    try {
      await db.collection("orders").deleteOne({ id });
      return { success: true };
    } catch (error: any) {
      console.error("deleteOrderServerFn error:", error);
      return { success: false, error: error?.message };
    }
  });

// 4. Gallery Server Functions
export const fetchGalleryServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = await getDatabase();
  if (!db) return null;

  try {
    const docs = await db.collection("gallery").find({}).toArray();
    return docs.map((d) => sanitizeDoc<GalleryItem>(d));
  } catch (error) {
    console.error("fetchGalleryServerFn error:", error);
    return null;
  }
});

export const addGalleryItemServerFn = createServerFn({ method: "POST" })
  .validator((item: GalleryItem) => item)
  .handler(async ({ data }) => {
    const db = await getDatabase();
    if (!db) return { success: false, reason: "no_db" };

    try {
      await db.collection("gallery").updateOne(
        { id: data.id },
        { $set: data },
        { upsert: true }
      );
      return { success: true, item: data };
    } catch (error: any) {
      console.error("addGalleryItemServerFn error:", error);
      return { success: false, error: error?.message };
    }
  });

export const deleteGalleryItemServerFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const db = await getDatabase();
    if (!db) return { success: false, reason: "no_db" };

    try {
      await db.collection("gallery").deleteOne({ id });
      return { success: true };
    } catch (error: any) {
      console.error("deleteGalleryItemServerFn error:", error);
      return { success: false, error: error?.message };
    }
  });

// 5. Messages Server Functions
export const fetchMessagesServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = await getDatabase();
  if (!db) return null;

  try {
    const docs = await db.collection("messages").find({}).sort({ date: -1 }).toArray();
    return docs.map((d) => sanitizeDoc<ContactMessage>(d));
  } catch (error) {
    console.error("fetchMessagesServerFn error:", error);
    return null;
  }
});

export const sendMessageServerFn = createServerFn({ method: "POST" })
  .validator((msg: ContactMessage) => msg)
  .handler(async ({ data }) => {
    const db = await getDatabase();
    if (!db) return { success: false, reason: "no_db" };

    try {
      await db.collection("messages").updateOne(
        { id: data.id },
        { $set: data },
        { upsert: true }
      );
      return { success: true, message: data };
    } catch (error: any) {
      console.error("sendMessageServerFn error:", error);
      return { success: false, error: error?.message };
    }
  });

export const markMessageReadServerFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const db = await getDatabase();
    if (!db) return { success: false, reason: "no_db" };

    try {
      await db.collection("messages").updateOne({ id }, { $set: { isRead: true } });
      return { success: true };
    } catch (error: any) {
      console.error("markMessageReadServerFn error:", error);
      return { success: false, error: error?.message };
    }
  });

export const deleteMessageServerFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const db = await getDatabase();
    if (!db) return { success: false, reason: "no_db" };

    try {
      await db.collection("messages").deleteOne({ id });
      return { success: true };
    } catch (error: any) {
      console.error("deleteMessageServerFn error:", error);
      return { success: false, error: error?.message };
    }
  });

// 6. Settings Server Functions
export const fetchSettingsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const db = await getDatabase();
  if (!db) return null;

  try {
    const doc = await db.collection("settings").findOne({ key: "site_settings" });
    if (!doc) return null;
    const { _id, key, ...settings } = doc;
    return settings as SiteSettings;
  } catch (error) {
    console.error("fetchSettingsServerFn error:", error);
    return null;
  }
});

export const updateSettingsServerFn = createServerFn({ method: "POST" })
  .validator((settings: SiteSettings) => settings)
  .handler(async ({ data }) => {
    const db = await getDatabase();
    if (!db) return { success: false, reason: "no_db" };

    try {
      await db.collection("settings").updateOne(
        { key: "site_settings" },
        { $set: { ...data, key: "site_settings", updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      return { success: true, settings: data };
    } catch (error: any) {
      console.error("updateSettingsServerFn error:", error);
      return { success: false, error: error?.message };
    }
  });

// 7. Bulk Sync / Initial Seeding Server Function
export const syncAllDataToMongoServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      products?: ProductItem[];
      orders?: OrderItem[];
      gallery?: GalleryItem[];
      messages?: ContactMessage[];
      settings?: SiteSettings;
    }) => data
  )
  .handler(async ({ data }) => {
    const db = await getDatabase();
    if (!db) {
      return { success: false, message: "MongoDB not connected" };
    }

    try {
      if (data.products && data.products.length > 0) {
        for (const item of data.products) {
          await db.collection("products").updateOne({ id: item.id }, { $set: item }, { upsert: true });
        }
      }
      if (data.orders && data.orders.length > 0) {
        for (const item of data.orders) {
          await db.collection("orders").updateOne({ id: item.id }, { $set: item }, { upsert: true });
        }
      }
      if (data.gallery && data.gallery.length > 0) {
        for (const item of data.gallery) {
          await db.collection("gallery").updateOne({ id: item.id }, { $set: item }, { upsert: true });
        }
      }
      if (data.messages && data.messages.length > 0) {
        for (const item of data.messages) {
          await db.collection("messages").updateOne({ id: item.id }, { $set: item }, { upsert: true });
        }
      }
      if (data.settings) {
        await db.collection("settings").updateOne(
          { key: "site_settings" },
          { $set: { ...data.settings, key: "site_settings", updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
      }

      return { success: true, message: "All data synced to MongoDB successfully" };
    } catch (error: any) {
      console.error("syncAllDataToMongoServerFn error:", error);
      return { success: false, error: error?.message };
    }
  });

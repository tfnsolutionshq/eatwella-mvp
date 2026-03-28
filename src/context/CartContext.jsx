import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext(null);

// Helper to get or generate a random Cart ID
const getCartId = () => {
  let cartId = localStorage.getItem("eatwella_cart_id");
  if (!cartId) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    cartId = Array.from({ length: 40 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");
    localStorage.setItem("eatwella_cart_id", cartId);
  }
  return cartId;
};

const cartApi = axios.create({
  baseURL: "https://eatwella.tfnsolutions.us/api",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  withCredentials: true,
});

cartApi.interceptors.request.use(
  (config) => {
    const cartId = getCartId();
    if (cartId) config.headers["X-Cart-ID"] = cartId;
    return config;
  },
  (error) => Promise.reject(error),
);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("eatwella_cart");
      return savedCart ? JSON.parse(savedCart) : null;
    } catch (err) {
      console.error("Failed to load cart from local storage:", err);
      return null;
    }
  });
  const [loadingItems, setLoadingItems] = useState({});

  // ── Packaging selections: lives here so it is immune to CartItems re-renders ──
  // Shape: { [cartItemId]: packagingObject | null }
  const [itemPackaging, setItemPackaging] = useState({});

  const updateItemPackaging = (cartItemId, packagingOption) => {
    // packagingOption is the full packaging object, or null to clear
    console.log("Siuuu: ", packagingOption);
    setItemPackaging((prev) => ({ ...prev, [cartItemId]: packagingOption }));
  };

  const clearItemPackaging = (cartItemId) => {
    setItemPackaging((prev) => {
      const next = { ...prev };
      delete next[cartItemId];
      return next;
    });
  };

  // When an item is removed from the cart, also remove its packaging selection
  const removePackagingForItem = (cartItemId) => {
    setItemPackaging((prev) => {
      const next = { ...prev };
      delete next[cartItemId];
      return next;
    });
  };

  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (cart) localStorage.setItem("eatwella_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await cartApi.get("/cart");
      console.log("✅ Fetched cart:", data);
      if (!data.items || data.items.length === 0) {
        console.log("ℹ️ Server cart empty. Clearing local cart for sync.");
        clearCart();
      } else {
        setCart(data);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      if (
        err.response &&
        (err.response.status === 404 || err.response.status === 204)
      ) {
        clearCart();
      }
    }
  };

  const addToCart = async (menuId, quantity = 1) => {
    setLoadingItems((prev) => ({ ...prev, [menuId]: true }));
    try {
      const { data } = await cartApi.post("/cart", {
        menu_id: menuId,
        quantity,
      });
      console.log("✅ Added to cart:", data);
      if (data && data.items) {
        setCart(data);
      } else {
        await fetchCart();
      }
      return true;
    } catch (err) {
      console.error("Failed to add to cart:", err);
      return null;
    } finally {
      setLoadingItems((prev) => ({ ...prev, [menuId]: false }));
    }
  };

  const updateCartItem = async (
    cartItemId,
    quantity = null,
    packageId = null,
  ) => {
    console.log(
      "cart item ID: ",
      cartItemId,
      "quantity: ",
      quantity,
      "package ID: ",
      packageId,
    );
    try {
      const { data } = await cartApi.put(`/cart/${cartItemId}`, {
        quantity,
        packaging_id: packageId,
      });
      console.log("✅ Updated cart item:", data);
      if (data && data.items) {
        setCart(data);
      } else {
        await fetchCart();
      }
      return true;
    } catch (err) {
      console.error("Failed to update cart item:", err);
      await fetchCart();
      return false;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const { data } = await cartApi.delete(`/cart/${cartItemId}`);
      console.log("✅ Removed from cart:", data);
      // Clean up this item's packaging selection when it's removed
      removePackagingForItem(cartItemId);
      if (data && data.items) {
        setCart(data);
      } else {
        await fetchCart();
      }
      return true;
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      await fetchCart();
      return false;
    }
  };

  const applyDiscount = async (code) => {
    try {
      const { data } = await cartApi.post("/cart/apply-discount", { code });
      console.log("✅ Discount applied:", data);
      if (data && data.cart && data.cart.items) {
        setCart(data.cart);
      } else if (data && data.items) {
        setCart(data);
      } else {
        await fetchCart();
      }
      return {
        success: true,
        message: data.message || "Discount applied successfully",
      };
    } catch (err) {
      console.error("Failed to apply discount:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to apply discount",
      };
    }
  };

  const removeDiscount = async () => {
    try {
      const { data } = await cartApi.delete("/cart/remove-discount");
      console.log("✅ Discount removed:", data);
      if (data && data.items) {
        setCart(data);
      } else if (data && data.cart && data.cart.items) {
        setCart(data.cart);
      } else {
        await fetchCart();
      }
      return { success: true };
    } catch (err) {
      console.error("Failed to remove discount:", err);
      await fetchCart();
      return {
        success: false,
        message: err.response?.data?.message || "Failed to remove discount",
      };
    }
  };

  const cartItemCount =
    cart?.total_items ||
    cart?.items?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) ||
    0;

  const clearCart = async () => {
    try {
      const itemsToRemove = cart?.items || [];
      if (itemsToRemove.length > 0) {
        await Promise.all(
          itemsToRemove.map((item) => cartApi.delete(`/cart/${item.id}`)),
        );
        console.log("✅ All cart items removed from server");
      }
    } catch (err) {
      console.error("Failed to clear cart from server:", err);
    }
    setCart({ items: [] });
    setItemPackaging({}); // also wipe all packaging selections on full clear
    try {
      localStorage.removeItem("eatwella_cart");
      localStorage.removeItem("eatwella_cart_id");
    } catch (err) {
      console.error("Failed to clear cart from local storage:", err);
    }
  };

  console.log("🛍️ Current cart item count:", cartItemCount, cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCartItem,
        removeFromCart,
        applyDiscount,
        removeDiscount,
        fetchCart,
        loadingItems,
        cartItemCount,
        clearCart,
        // ── Packaging ──
        itemPackaging,
        updateItemPackaging,
        clearItemPackaging,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

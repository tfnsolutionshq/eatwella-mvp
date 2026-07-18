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
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  withCredentials: true,
});

cartApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
      if (!data.items || data.items.length === 0) {
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

  const addToCart = async (menuId, quantity = 1, outletId) => {
    setLoadingItems((prev) => ({ ...prev, [menuId]: true }));
    try {
      const { data, headers } = await cartApi.post("/cart", {
        menu_id: menuId,
        quantity,
        outlet_id: outletId,
      });
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
    try {
      const { data } = await cartApi.put(`/cart/${cartItemId}`, {
        quantity,
        packaging_id: packageId,
      });
      if (data && data.items) {
        setCart(data);
      } else {
        await fetchCart();
      }
      return { success: true };
    } catch (err) {
      console.error("Failed to update cart item:", err);

      // Extract the exact error message from server response
      let errorMessage = "Failed to update cart item";

      if (err.response?.data) {
        // Handle different error response formats
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.errors) {
          // Handle validation errors (array of messages)
          if (Array.isArray(err.response.data.errors)) {
            errorMessage = err.response.data.errors.join(", ");
          } else if (typeof err.response.data.errors === "object") {
            // Handle object-based validation errors
            const errorMessages = Object.values(
              err.response.data.errors,
            ).flat();
            errorMessage = errorMessages.join(", ");
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      await fetchCart();
      return {
        success: false,
        message: errorMessage,
        status: err.response?.status,
        statusText: err.response?.statusText,
      };
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const { data } = await cartApi.delete(`/cart/${cartItemId}`);
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
      await cartApi.delete("/cart");
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

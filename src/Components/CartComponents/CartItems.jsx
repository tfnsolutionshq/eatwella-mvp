import { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaTimes, FaChevronDown } from "react-icons/fa";
import { MdHome, MdRestaurant, MdDeliveryDining } from "react-icons/md";
import { DollarSign, CreditCard, ArrowRightCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../utils/api";

function CartItems() {
  const navigate = useNavigate();
  const {
    cart,
    updateCartItem,
    removeFromCart,
    applyDiscount,
    removeDiscount,
    addToCart,
  } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedOrderType, setSelectedOrderType] = useState("dine-in");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("gateway");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState({
    type: "",
    text: "",
  });
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [removingDiscount, setRemovingDiscount] = useState(false);
  const [quantityLoading, setQuantityLoading] = useState({});
  const [recommendedSideDishes, setRecommendedSideDishes] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [packagingLoading, setPackagingLoading] = useState(true);
  const [packagingError, setPackagingError] = useState(false);
  const [availabilitySettings, setAvailabilitySettings] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);

  const cartItems = cart?.items || [];

  // ── Keep a ref to cartItems so the order-type effect always sees current items
  const cartItemsRef = useRef(cartItems);
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  useEffect(() => {
    getRecommendedSideDishes();
  }, [cartItems.length]);

  useEffect(() => {
    fetchPackagingOptions();
    fetchAvailabilitySettings();
  }, []);

  // Auto-select first available order type when availability settings are loaded
  useEffect(() => {
    if (!availabilityLoading && availabilitySettings) {
      const availableTypes = getAvailableOrderTypes();
      if (
        availableTypes.length > 0 &&
        !availableTypes.find((type) => type.key === selectedOrderType)
      ) {
        setSelectedOrderType(availableTypes[0].key);
      }
    }
  }, [availabilityLoading, availabilitySettings, selectedOrderType]);

  const fetchAvailabilitySettings = async () => {
    try {
      const res = await api.get("/availability-hours");
      setAvailabilitySettings(res.data?.availability_hours || []);
    } catch (err) {
      console.error("Failed to fetch availability settings:", err);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const getAvailableOrderTypes = () => {
    if (!availabilitySettings || availabilityLoading) {
      return [
        {
          key: "dine-in",
          label: "Dine-in",
          desc: "Enjoy your meal at our restaurant",
          Icon: MdHome,
        },
        {
          key: "pickup",
          label: "Pickup",
          desc: "Pickup your order from restaurant",
          Icon: MdRestaurant,
        },
        {
          key: "delivery",
          label: "Delivery",
          desc: "We'll deliver to your address",
          Icon: MdDeliveryDining,
        },
      ];
    }

    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todaySettings = availabilitySettings.find(
      (setting) => setting.day === today,
    );

    if (!todaySettings || !todaySettings.enabled) {
      return [];
    }

    const orderTypes = [];
    if (todaySettings.order_types?.dine) {
      orderTypes.push({
        key: "dine-in",
        label: "Dine-in",
        desc: "Enjoy your meal at our restaurant",
        Icon: MdHome,
      });
    }
    if (todaySettings.order_types?.pickup) {
      orderTypes.push({
        key: "pickup",
        label: "Pickup",
        desc: "Pickup your order from restaurant",
        Icon: MdRestaurant,
      });
    }
    if (todaySettings.order_types?.delivery) {
      orderTypes.push({
        key: "delivery",
        label: "Delivery",
        desc: "We'll deliver to your address",
        Icon: MdDeliveryDining,
      });
    }

    return orderTypes;
  };

  // Auto-assign default packaging for takeaway items once options are loaded
  useEffect(() => {
    const assignDefaultPackaging = async () => {
      if (packagingLoading) return;
      if (!packagingOptions.length) return;
      if (selectedOrderType === "dine-in") return;

      cartItems.forEach(async (item) => {
        if (item.menu.requires_takeaway && !item.packaging) {
          const defaultPackaging = packagingOptions[0];
          if (defaultPackaging) {
            const result = await updateCartItem(
              item.id,
              item.quantity,
              defaultPackaging.id,
            );
            if (!result.success) {
              console.error("Failed to set default packaging:", result.message);
            }
          }
        }
      });
    };

    assignDefaultPackaging();
  }, [packagingLoading, packagingOptions, selectedOrderType]);

  // ── When switching to dine-in, strip packaging from every cart item ──────────
  useEffect(() => {
    if (selectedOrderType !== "dine-in") return;

    // Use the ref so we always act on the current cart, not a stale snapshot
    const current = cartItemsRef.current;
    const itemsWithPackaging = current.filter((item) => item.packaging);

    if (!itemsWithPackaging.length) return;

    // Fire all updates in parallel — no need to await each one sequentially
    Promise.all(
      itemsWithPackaging.map((item) =>
        updateCartItem(item.id, item.quantity, null),
      ),
    ).catch((err) => {
      console.error("Failed to clear packaging:", err.message || err);
    });
  }, [selectedOrderType]);
  // ─────────────────────────────────────────────────────────────────────────────

  const fetchPackagingOptions = async () => {
    setPackagingLoading(true);
    setPackagingError(false);
    try {
      const { data } = await api.get("/packagings");
      setPackagingOptions(Array.isArray(data) ? data : (data.data ?? []));
    } catch (err) {
      console.error("Failed to fetch packaging options:", err);
      setPackagingError(true);
    } finally {
      setPackagingLoading(false);
    }
  };

  const handlePackagingChange = async (cartItemId, quantity, selectedId) => {
    if (!selectedId) return;
    const match = packagingOptions.find(
      (p) => String(p.id) === String(selectedId),
    );
    if (!match) {
      console.warn("Packaging not found for:", selectedId);
      return;
    }
    const result = await updateCartItem(cartItemId, quantity, match.id);
    if (!result.success) {
      console.error("Failed to update packaging:", result.message);
    }
  };

  const getRecommendedSideDishes = async () => {
    setLoadingRecommendations(true);
    try {
      const menuArray = cartItems.map((cartItem) => ({
        menuId: cartItem.menu.id,
        menuItemName: cartItem.menu.name,
      }));

      const sideDishArray = [];
      await Promise.all(
        menuArray.map(async (menu) => {
          const { data } = await api.get(`/menus/${menu.menuId}`);
          sideDishArray.push({
            menuId: menu.menuId,
            menuItemName: menu.menuItemName,
            menuItemComplements: data.complements,
          });
        }),
      );

      const seen = new Set();
      const uniqueComplements = sideDishArray
        .flatMap((item) => item.menuItemComplements)
        .filter((complement) => {
          if (seen.has(complement.id)) return false;
          seen.add(complement.id);
          return true;
        });

      setRecommendedSideDishes(uniqueComplements);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleAddToCart = async (id) => {
    setAddingToCart((prev) => ({ ...prev, [id]: true }));
    try {
      await addToCart(id, 1);

      // After adding to cart, check if the item requires packaging and auto-assign default packaging
      if (selectedOrderType !== "dine-in" && packagingOptions.length > 0) {
        // Wait a moment for the cart to be updated, then fetch the updated cart
        await new Promise((resolve) => setTimeout(resolve, 100));
        await fetchCart();

        // Find the newly added item (it will be the last item if it matches our menu ID)
        const updatedCart = cart?.items || [];
        const newItem = updatedCart.find((item) => item.menu.id === id);

        if (newItem && newItem.menu.requires_takeaway && !newItem.packaging) {
          const defaultPackaging = packagingOptions[0];
          if (defaultPackaging) {
            const result = await updateCartItem(
              newItem.id,
              newItem.quantity,
              defaultPackaging.id,
            );
            if (!result.success) {
              console.error(
                "Failed to set default packaging for new item:",
                result.message,
              );
            } else {
              // Refresh the cart again to ensure the price is updated with packaging
              await fetchCart();
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setAddingToCart((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setApplyingDiscount(true);
    setDiscountMessage({ type: "info", text: "Applying..." });
    const result = await applyDiscount(discountCode);
    setDiscountMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
    if (result.success) setDiscountCode("");
    setApplyingDiscount(false);
  };

  const handleUpdateQuantity = async (
    itemId,
    currentQuantity,
    change,
    packaging_id,
  ) => {
    const newQuantity = Number(currentQuantity) + change;
    if (newQuantity < 1) return;
    setQuantityLoading((prev) => ({ ...prev, [itemId]: true }));
    const result = await updateCartItem(itemId, newQuantity, packaging_id);
    if (!result.success) {
      console.error("Failed to update quantity:", result.message);
      // Optionally show toast to user
      showToast(result.message, "error");
    }
    setQuantityLoading((prev) => ({ ...prev, [itemId]: false }));
  };

  const handleRemoveItem = async (itemId) => {
    setOpenIndex(null);
    await removeFromCart(itemId);
  };

  const handleRemoveDiscount = async () => {
    setRemovingDiscount(true);
    const res = await removeDiscount();
    if (res?.success) {
      setDiscountMessage({ type: "success", text: "Discount removed" });
    } else {
      setDiscountMessage({
        type: "error",
        text: res?.message || "Failed to remove discount",
      });
    }
    setRemovingDiscount(false);
  };

  const handleProceedToCheckout = () => {
    const packagingSelections = {};
    if (selectedOrderType !== "dine-in") {
      cartItems.forEach((item) => {
        if (item.packaging) {
          packagingSelections[item.id] = item.packaging.id;
        }
      });
    }

    if (selectedOrderType === "delivery") {
      navigate("/order-type", {
        state: {
          orderType: selectedOrderType,
          paymentMethod: "gateway",
          packagingSelections,
        },
      });
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleConfirmCheckout = async () => {
    const packagingSelections = {};
    if (selectedOrderType !== "dine-in") {
      cartItems.forEach((item) => {
        if (item.packaging) {
          packagingSelections[item.id] = item.packaging.id;
        }
      });
    }

    if (selectedPaymentMethod === "cash") {
      setProcessingCheckout(true);
      navigate("/order-type", {
        state: {
          orderType: selectedOrderType,
          paymentMethod: "cash",
          packagingSelections,
        },
      });
    } else {
      navigate("/order-type", {
        state: {
          orderType: selectedOrderType,
          paymentMethod: "gateway",
          packagingSelections,
        },
      });
    }
  };

  const handleToggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // ── Totals ────────────────────────────────────────────────────────────────────
  const isDineIn = selectedOrderType === "dine-in";

  const baseSubtotal = cart?.subtotal
    ? Number(cart.subtotal)
    : cartItems.reduce(
        (sum, item) => sum + Number(item.menu.price) * item.quantity,
        0,
      );

  const totalPackagingFee = isDineIn
    ? 0
    : cartItems.reduce(
        (sum, item) => sum + (item.packaging?.price ?? 0) * item.quantity,
        0,
      );

  const subtotal = baseSubtotal + totalPackagingFee;

  const serverDiscountAmount = Number(cart?.discount_amount || 0);
  const discountRate =
    baseSubtotal > 0 ? serverDiscountAmount / baseSubtotal : 0;
  const discountAmount = baseSubtotal * discountRate;
  const discountPercent = Math.round(discountRate * 100);

  const finalTotal = subtotal - discountAmount;

  // Check if all items requiring packaging have packaging selected
  const hasMissingPackaging = () => {
    if (selectedOrderType === "dine-in") return false;
    return cartItems.some(
      (item) => item.menu.requires_takeaway && !item.packaging,
    );
  };
  // ─────────────────────────────────────────────────────────────────────────────

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 py-12 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/menu")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 mb-8 hover:text-gray-800"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        {/* Food Items in Cart */}
        <div className="bg-white rounded-3xl p-6 overflow-y-auto mb-8 h-[600px]">
          <div>
            <h3 className="font-bold text-xl">Your Food Items</h3>
            <p className="text-sm text-gray-500">All food items you picked.</p>
          </div>
          <div className="mt-5">
            {cartItems.map((item) => {
              // ── Only include packaging in the per-item price when not dine-in ──
              const packagingPrice = isDineIn
                ? 0
                : (item.packaging?.price ?? 0);
              const itemTotal =
                Number(item.menu?.price) * item.quantity + packagingPrice;

              return (
                <div
                  key={item.id}
                  className="mb-6 pb-6 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.menu?.images?.[0] ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={item.menu?.name}
                      className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.menu?.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          minimumFractionDigits: 0,
                        }).format(item.menu?.price)}{" "}
                        each
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-1">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.quantity,
                                -1,
                                isDineIn ? null : (item.packaging?.id ?? ""),
                              )
                            }
                            className="w-6 h-6 flex items-center justify-center hover:text-orange-500 font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                            disabled={
                              Number(item.quantity) <= 1 ||
                              quantityLoading[item.id]
                            }
                          >
                            −
                          </button>
                          <span className="font-bold px-2">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.quantity,
                                1,
                                isDineIn ? null : (item.packaging?.id ?? ""),
                              )
                            }
                            className="w-6 h-6 flex items-center justify-center hover:text-orange-500 font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={quantityLoading[item.id]}
                          >
                            +
                          </button>
                          {quantityLoading[item.id] && (
                            <span className="spinner-dark spinner ml-2" />
                          )}
                        </div>
                        <span className="text-orange-500 font-black">
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                            minimumFractionDigits: 0,
                          }).format(itemTotal)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500 self-start"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {/* Per-item packaging selector — hidden on dine-in */}
                  {item.menu.requires_takeaway && !isDineIn && (
                    <div className="mt-3 ml-24">
                      {packagingLoading ? (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="w-3 h-3 border-2 border-gray-200 border-t-orange-400 rounded-full animate-spin" />
                          Loading takeaway options…
                        </div>
                      ) : packagingError ? (
                        <button
                          onClick={fetchPackagingOptions}
                          className="text-xs bg-red-200 text-red-600 hover:text-orange-600 font-medium flex items-center gap-1"
                        >
                          <ArrowRightCircle className="w-3 h-3 mr-1"/>
                          Retry loading packaging options
                        </button>
                      ) : packagingOptions.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <select
                              value={item.packaging?.id ?? ""}
                              onChange={async (e) => {
                                const selected = packagingOptions.find(
                                  (p) => String(p.id) === e.target.value,
                                );
                                try {
                                  setPackagingLoading(true);
                                  const result = await updateCartItem(
                                    item.id,
                                    item.quantity,
                                    selected ? selected.id : null,
                                  );
                                  if (!result.success) {
                                    showToast(result.message, "error");
                                  }
                                } finally {
                                  setPackagingLoading(false);
                                }
                              }}
                              className="w-full appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:border-orange-400 bg-white cursor-pointer"
                            >
                              {packagingOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.size_name.charAt(0).toUpperCase() +
                                    option.size_name.slice(1)}{" "}
                                  — ₦{Number(option.price).toLocaleString()}
                                </option>
                              ))}
                            </select>
                            <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-gray-400" />
                          </div>
                          {item.packaging && (
                            <span className="text-xs font-semibold text-orange-500 whitespace-nowrap">
                              +₦{Number(item.packaging.price).toLocaleString()}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended side dishes */}
        <div className="bg-white rounded-3xl p-6 overflow-y-auto mb-8 h-[600px]">
          <div>
            <h3 className="font-bold text-xl">Recommended Side Dishes</h3>
            <p className="text-sm text-gray-500">
              Some other items to go along with items in your cart.
            </p>
          </div>
          <div className="mt-5">
            {loadingRecommendations ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <div className="w-10 h-10 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin mb-3" />
                <p className="text-sm font-medium">
                  Loading recommendations...
                </p>
              </div>
            ) : recommendedSideDishes.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recommendedSideDishes.map((complement) => (
                  <div
                    key={complement.id}
                    className="py-3 text-sm text-gray-600 flex items-center justify-between"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={complement?.images?.[0]}
                        alt={complement.name}
                        className="w-20 h-20 rounded-2xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-lg">{complement.name}</p>
                        <p>
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                            minimumFractionDigits: 0,
                          }).format(complement.price)}{" "}
                          each
                        </p>
                      </div>
                    </div>
                    <button
                      className="bg-orange-500 px-5 py-2 rounded-full text-white flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      onClick={() => handleAddToCart(complement.id)}
                      disabled={
                        complement.stock_quantity < 1 ||
                        addingToCart[complement.id]
                      }
                    >
                      {addingToCart[complement.id] ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : complement.stock_quantity < 1 ? (
                        "Out of Stock"
                      ) : (
                        "Add To Cart"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-6">
                No recommendations for now
              </p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-3xl p-6 overflow-y-auto h-[400px]">
            <h3 className="font-black text-xl mb-6">Select Order Type</h3>
            {availabilityLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border-2 border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : getAvailableOrderTypes().length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm mb-2">
                  No order types available today
                </p>
                <p className="text-gray-400 text-xs">
                  Please check back during operating hours
                </p>
              </div>
            ) : (
              getAvailableOrderTypes().map(({ key, label, desc, Icon }) => (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedOrderType(key);
                  }}
                  className={`p-4 rounded-2xl mb-4 cursor-pointer border-2 transition-colors ${
                    selectedOrderType === key
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-orange-500 text-2xl" />
                    <div>
                      <h4 className="font-bold">{label}</h4>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 overflow-y-auto h-[400px] flex flex-col justify-between">
            <div>
              <h3 className="font-black text-xl mb-4">Discount Code</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="23AD"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-orange-500"
                />
                <button
                  onClick={handleApplyDiscount}
                  disabled={!discountCode.trim() || applyingDiscount}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-bold transition-colors flex items-center gap-2"
                >
                  {applyingDiscount ? <span className="spinner" /> : null}
                  {applyingDiscount ? "Applying..." : "Apply"}
                </button>
              </div>
              {discountMessage.text && (
                <p
                  className={`text-sm mb-4 ${
                    discountMessage.type === "success"
                      ? "text-green-600"
                      : discountMessage.type === "error"
                        ? "text-red-500"
                        : "text-gray-500"
                  }`}
                >
                  {discountMessage.text}
                </p>
              )}
            </div>

            <div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm mt-6">
                  <span className="text-gray-600">
                    Subtotal (i.e. total price without packaging)
                  </span>
                  <span className="font-bold">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      minimumFractionDigits: 0,
                    }).format(baseSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm mt-6">
                  <span className="text-gray-600">Packaging Fee</span>
                  {/* Always show ₦0 on dine-in; show loading only on other types */}
                  {isDineIn ? (
                    <span className="font-bold">₦0</span>
                  ) : packagingLoading ? (
                    <span className="text-gray-400 text-xs">
                      Loading packaging fee…
                    </span>
                  ) : (
                    <span className="font-bold">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 0,
                      }).format(totalPackagingFee)}
                    </span>
                  )}
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{`Discount (${discountPercent}%)`}</span>
                    <span className="font-bold flex items-center gap-2">
                      -
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 0,
                      }).format(discountAmount)}
                      <button
                        onClick={handleRemoveDiscount}
                        disabled={removingDiscount}
                        className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {removingDiscount ? (
                          <span className="spinner" />
                        ) : (
                          <FaTimes className="w-3 h-3" />
                        )}
                      </button>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-6">
                <span className="font-black text-xl">
                  {discountAmount > 0 ? "New Total" : "Total"}
                </span>
                <span className="font-black text-2xl text-orange-500">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  }).format(finalTotal)}
                </span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={hasMissingPackaging() || packagingLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-full font-bold transition-colors"
              >
                {packagingLoading
                  ? "Loading packaging options..."
                  : hasMissingPackaging()
                    ? "Please select packaging for all items"
                    : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Select Payment Method
            </h3>
            <div className="space-y-3 mb-6">
              {[
                {
                  key: "gateway",
                  label: "Online Payment",
                  desc: "Pay with card or bank transfer",
                  Icon: CreditCard,
                },
                // {
                //   key: "cash",
                //   label: "Cash Payment",
                //   desc: "Pay with cash",
                //   Icon: DollarSign,
                // },
              ].map(({ key, label, desc, Icon }) => (
                <div
                  key={key}
                  onClick={() => setSelectedPaymentMethod(key)}
                  className={`p-4 rounded-xl cursor-pointer border-2 transition-colors ${
                    selectedPaymentMethod === key
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-orange-500" />
                    <div>
                      <h4 className="font-bold">{label}</h4>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCheckout}
                disabled={processingCheckout}
                className="flex-1 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {processingCheckout ? "Processing..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartItems;

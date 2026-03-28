import { useState, useEffect } from "react";
import { FaArrowLeft, FaTimes, FaChevronDown } from "react-icons/fa";
import { MdHome, MdRestaurant, MdDeliveryDining } from "react-icons/md";
import { Wallet, CreditCard } from "lucide-react";
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

  // ── Packaging options (fetched once, shared across all selectors) ────────────
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [packagingLoading, setPackagingLoading] = useState(true);
  // ─────────────────────────────────────────────────────────────────────────────

  const cartItems = cart?.items || [];

  useEffect(() => {
    getRecommendedSideDishes();
  }, [cartItems.length]);

  useEffect(() => {
    fetchPackagingOptions();
  }, []);

  const fetchPackagingOptions = async () => {
    setPackagingLoading(true);
    try {
      const { data } = await api.get("/packagings");
      setPackagingOptions(Array.isArray(data) ? data : (data.data ?? []));
    } catch (err) {
      console.error("Failed to fetch packaging options:", err);
    } finally {
      setPackagingLoading(false);
    }
  };

  // Writes directly into context — survives any re-render caused by cart updates
  const handlePackagingChange = (cartItemId, quantity, selectedId) => {
    if (!selectedId) {
      return;
    }

    const match = packagingOptions.find(
      (p) => String(p.id) === String(selectedId),
    );

    if (!match) {
      console.warn("Packaging not found for:", selectedId);
      return;
    }

    updateCartItem(cartItemId, quantity, match.id);
  };

  const getRecommendedSideDishes = async () => {
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
    setRecommendedSideDishes(sideDishArray);
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
    await updateCartItem(itemId, newQuantity, packaging_id);
    setQuantityLoading((prev) => ({ ...prev, [itemId]: false }));
  };

  const handleRemoveItem = async (itemId) => {
    setOpenIndex(null);
    await removeFromCart(itemId); // context also cleans up packaging for this item
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
    console.log("Lorem Ipsum: ", selectedOrderType);
    const packagingSelections = {};
    cartItems.forEach((item) => {
      if (item.packaging) {
        packagingSelections[item.id] = item.packaging.id;
      }
    });
    if (!user) {
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
    console.log("Here we are");

    const packagingSelections = {};

    cartItems.forEach((item) => {
      if (item.packaging) {
        packagingSelections[item.id] = item.packaging.id;
      }
    });

    if (selectedPaymentMethod === "loyalty_points") {
      setProcessingCheckout(true);
      try {
        await api.post("/checkout", {
          order_type: selectedOrderType,
          payment_type: "loyalty_points",
          customer_email: user.email,
          packaging: packagingSelections,
        });
        showToast("Order placed successfully with loyalty points!");
        navigate("/receipt");
      } catch (err) {
        showToast(
          err.response?.data?.message ||
            "Failed to process loyalty points payment",
          "error",
        );
      } finally {
        setProcessingCheckout(false);
      }
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

  // ── Totals ───────────────────────────────────────────────────────────────────
  const baseSubtotal = cart?.subtotal
    ? Number(cart.subtotal)
    : cartItems.reduce(
        (sum, item) => sum + Number(item.menu.price) * item.quantity,
        0,
      );

  // totalPackagingFee is computed inside context and stays stable
  const totalPackagingFee = cartItems.reduce(
    (sum, item) => sum + (item.packaging?.price ?? 0) * item.quantity,
    0,
  );
  const subtotal = baseSubtotal + totalPackagingFee;
  const discountAmount = Number(cart?.discount_amount || 0);
  const finalTotal = subtotal - discountAmount;
  const discountPercent =
    baseSubtotal > 0 ? Math.round((discountAmount / baseSubtotal) * 100) : 0;
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

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* ── Left column ── */}
          <div className="flex flex-col gap-6 h-full">
            <div className="bg-white rounded-3xl p-6 overflow-y-auto h-[400px]">
              {cartItems.map((item) => {
                // const selectedPkg = itemPackaging[item.id] ?? null;
                const itemTotal =
                  Number(item.menu?.price) * item.quantity +
                  (item.packaging ? Number(item.packaging.price) : 0);

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
                          ₦{Number(item.menu?.price).toFixed(2)} each
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-1">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  item.quantity,
                                  -1,
                                  item.packaging?.id ?? "",
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
                                  item.packaging?.id ?? "",
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
                            ₦{itemTotal.toFixed(2)}
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

                    {/* Per-item packaging selector */}
                    {item.menu.requires_takeaway && (
                      <div className="mt-3 ml-24">
                        {packagingLoading ? (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="w-3 h-3 border-2 border-gray-200 border-t-orange-400 rounded-full animate-spin" />
                            Loading packaging…
                          </div>
                        ) : packagingOptions.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <select
                                value={item.packaging?.id ?? ""}
                                onChange={(e) => {
                                  const selected = packagingOptions.find(
                                    (p) => String(p.id) === e.target.value,
                                  );
                                  try {
                                    setPackagingLoading(true);
                                    // Update the cart item with the new packaging ID
                                    updateCartItem(
                                      item.id,
                                      item.quantity,
                                      selected ? selected.id : null,
                                    );
                                  } finally {
                                    setPackagingLoading(false);
                                  }
                                }}
                                className="w-full appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:border-orange-400 bg-white cursor-pointer"
                              >
                                <option value="">
                                  No packaging selected yet
                                </option>
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
                                +₦
                                {Number(item.packaging.price).toLocaleString()}
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

            {/* Recommended side dishes */}
            <div className="bg-white rounded-3xl p-6 overflow-y-auto h-[400px]">
              <div>
                <h3 className="font-bold text-xl">Recommended Side Dishes</h3>
                <p className="text-sm text-gray-500">
                  Some other items to go along with items in your cart.
                </p>
              </div>
              <div className="mt-5">
                {recommendedSideDishes.length > 0 ? (
                  recommendedSideDishes.map((sideDish, index) => (
                    <div className="w-full" key={index}>
                      <button
                        type="button"
                        onClick={() => handleToggleAccordion(index)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                      >
                        <span>For your {sideDish.menuItemName}</span>
                        <FaChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            openIndex === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openIndex === index && (
                        <div className="border-t border-gray-100 divide-y divide-gray-100">
                          {sideDish.menuItemComplements.map((complement) => (
                            <div
                              key={complement.id}
                              className="px-5 py-3 text-sm text-gray-600 flex items-center justify-between"
                            >
                              <div className="flex gap-4 items-center">
                                <img
                                  src={complement?.images?.[0]}
                                  alt=""
                                  className="w-20 h-20 rounded-2xl object-cover"
                                />
                                <div>
                                  <p className="font-bold text-lg">
                                    {complement.name}
                                  </p>
                                  <p>₦{complement.price} each</p>
                                </div>
                              </div>
                              <button
                                className="bg-orange-500 px-5 py-2 rounded-full text-white"
                                onClick={() => addToCart(complement.id, 1)}
                              >
                                Add to Cart
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No recommendations for now</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-6 h-full">
            <div className="bg-white rounded-3xl p-6 overflow-y-auto h-[400px]">
              <h3 className="font-black text-xl mb-6">Select Order Type</h3>
              {[
                {
                  key: "dine-in",
                  label: "Dine-in",
                  desc: "Enjoy your meal at our restaurant",
                  Icon: MdHome,
                },
                {
                  key: "pickup",
                  label: "Pickup",
                  desc: "Pickup your order from the restaurant",
                  Icon: MdRestaurant,
                },
                {
                  key: "delivery",
                  label: "Delivery",
                  desc: "We'll deliver to your address",
                  Icon: MdDeliveryDining,
                },
              ].map(({ key, label, desc, Icon }) => (
                <div
                  key={key}
                  onClick={() => setSelectedOrderType(key)}
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
              ))}
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
                      ₦{baseSubtotal.toFixed(2)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>{`Discount (${discountPercent}%)`}</span>
                      <span className="font-bold flex items-center gap-2">
                        -₦{discountAmount.toFixed(2)}
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
                    ₦{finalTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-full font-bold transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
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
                {
                  key: "loyalty_points",
                  label: "Loyalty Points",
                  desc: "Redeem your points",
                  Icon: Wallet,
                },
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

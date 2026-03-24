import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
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
  } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedOrderType, setSelectedOrderType] = useState("dine-in");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("gateway");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState({
    type: "",
    text: "",
  });
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [removingDiscount, setRemovingDiscount] = useState(false);
  const [quantityLoading, setQuantityLoading] = useState({});

  const cartItems = cart?.items || [];

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      const { data } = await api.get("/admin/taxes");
      const activeTaxes = Array.isArray(data)
        ? data.filter((t) => t.is_active)
        : data.data?.filter((t) => t.is_active) || [];
      setTaxes(activeTaxes);
    } catch (err) {
      console.error("Failed to fetch taxes:", err);
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

    if (result.success) {
      setDiscountCode("");
    }
    setApplyingDiscount(false);
  };

  const handleUpdateQuantity = async (itemId, currentQuantity, change) => {
    const quantity = Number(currentQuantity);
    const newQuantity = quantity + change;
    if (newQuantity < 1) return;

    setQuantityLoading((prev) => ({ ...prev, [itemId]: true }));
    await updateCartItem(itemId, newQuantity);
    setQuantityLoading((prev) => ({ ...prev, [itemId]: false }));
  };

  const handleRemoveItem = async (itemId) => {
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
    if (!user) {
      navigate("/order-type", {
        state: {
          orderType: selectedOrderType,
          paymentMethod: "gateway",
        },
      });
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleConfirmCheckout = async () => {
    if (selectedPaymentMethod === "loyalty_points") {
      setProcessingCheckout(true);
      try {
        const orderData = {
          order_type: selectedOrderType,
          payment_type: "loyalty_points",
          customer_email: user.email,
        };
        await api.post("/checkout", orderData);
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
        },
      });
    }
  };

  const subtotal = cart?.subtotal
    ? Number(cart.subtotal)
    : cartItems.reduce(
        (sum, item) => sum + Number(item.menu.price) * item.quantity,
        0,
      );
  const deliveryFee = selectedOrderType === "delivery" ? 3.99 : 0;
  const discountAmount = Number(cart?.discount_amount || 0);

  const taxAmount = taxes.reduce((sum, tax) => {
    return sum + subtotal * (Number(tax.rate) / 100);
  }, 0);

  const originalTotal = subtotal + deliveryFee + taxAmount;
  const finalTotal = originalTotal - discountAmount;
  const discountPercent =
    originalTotal > 0 ? Math.round((discountAmount / originalTotal) * 100) : 0;

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

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-3xl p-6 h-fit">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 last:border-0"
              >
                <img
                  src={
                    item.menu?.images?.[0] ||
                    "https://via.placeholder.com/400x300"
                  }
                  alt={item.menu?.name}
                  className="w-20 h-20 rounded-2xl object-cover"
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
                          handleUpdateQuantity(item.id, item.quantity, -1)
                        }
                        className="w-6 h-6 flex items-center justify-center hover:text-orange-500 font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400"
                        disabled={
                          Number(item.quantity) <= 1 || quantityLoading[item.id]
                        }
                      >
                        −
                      </button>
                      <span className="font-bold px-2">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity, 1)
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
                      ₦{(Number(item.menu?.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-white rounded-3xl p-6 mb-6">
              <h3 className="font-black text-xl mb-6">Select Order Type</h3>

              <div
                onClick={() => setSelectedOrderType("dine-in")}
                className={`p-4 rounded-2xl mb-4 cursor-pointer border-2 transition-colors ${
                  selectedOrderType === "dine-in"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MdHome className="text-orange-500 text-2xl" />
                  <div>
                    <h4 className="font-bold">Dine-in</h4>
                    <p className="text-sm text-gray-600">
                      Enjoy your meal at our restaurant
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSelectedOrderType("pickup")}
                className={`p-4 rounded-2xl mb-4 cursor-pointer border-2 transition-colors ${
                  selectedOrderType === "pickup"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MdRestaurant className="text-orange-500 text-2xl" />
                  <div>
                    <h4 className="font-bold">Pickup</h4>
                    <p className="text-sm text-gray-600">
                      Pickup your order from the restaurant
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSelectedOrderType("delivery")}
                className={`p-4 rounded-2xl mb-4 cursor-pointer border-2 transition-colors ${
                  selectedOrderType === "delivery"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MdDeliveryDining className="text-orange-500 text-2xl" />
                  <div>
                    <h4 className="font-bold">Delivery</h4>
                    <p className="text-sm text-gray-600">
                      We'll deliver to your address
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6">
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
                  className={`text-sm mb-4 ${discountMessage.type === "success" ? "text-green-600" : discountMessage.type === "error" ? "text-red-500" : "text-gray-500"}`}
                >
                  {discountMessage.text}
                </p>
              )}

              <div className="space-y-3 mb-6">
                {discountAmount > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-bold">₦{subtotal.toFixed(2)}</span>
                    </div>
                    {taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-bold">
                          ₦{taxAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-green-600">
                      <span>{`Discount (${discountPercent}%):`}</span>
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
                  </>
                )}
                {discountAmount === 0 && taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-bold">₦{taxAmount.toFixed(2)}</span>
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

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Select Payment Method
            </h3>
            <div className="space-y-3 mb-6">
              <div
                onClick={() => setSelectedPaymentMethod("gateway")}
                className={`p-4 rounded-xl cursor-pointer border-2 transition-colors ${
                  selectedPaymentMethod === "gateway"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="text-orange-500" />
                  <div>
                    <h4 className="font-bold">Online Payment</h4>
                    <p className="text-sm text-gray-600">
                      Pay with card or bank transfer
                    </p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setSelectedPaymentMethod("loyalty_points")}
                className={`p-4 rounded-xl cursor-pointer border-2 transition-colors ${
                  selectedPaymentMethod === "loyalty_points"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="text-orange-500" />
                  <div>
                    <h4 className="font-bold">Loyalty Points</h4>
                    <p className="text-sm text-gray-600">Redeem your points</p>
                  </div>
                </div>
              </div>
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

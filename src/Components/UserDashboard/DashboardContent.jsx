import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiTrendingUp,
  FiStar,
  FiAward,
  FiChevronRight,
  FiShoppingBag,
  FiGift,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

// ── Per-item subtotal: menu subtotal + (packaging price × quantity) ──────────
// `item.subtotal` from the API = item.price × item.quantity (no packaging).
// `item.packaging_price` is the per-unit packaging cost.
const getItemSubtotal = (item) =>
  Number(item.subtotal) + Number(item.packaging_price ?? 0) * item.quantity;

// ── Order-level total: sum of all corrected item subtotals ───────────────────
// This replaces the API's `total_amount` which also excludes packaging.
const getOrderItemsTotal = (orderItems = []) =>
  orderItems.reduce((sum, item) => sum + getItemSubtotal(item), 0);

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [overview, setOverview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/customer/profile");
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    const fetchOverview = async () => {
      try {
        const { data } = await api.get("/customer/overview");
        setOverview(data);
      } catch (err) {
        console.error("Failed to fetch overview:", err);
      }
    };
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/customer/orders");
        console.log("Here is the data: ", data.data);
        setOrders(data.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchProfile();
    fetchOverview();
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await api.get("/customer/addresses");
        setAddresses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      }
    };
    if (activeTab === "profile") {
      fetchAddresses();
    }
  }, [activeTab]);

  const personal = {
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
    birthday: profile?.birthday
      ? new Date(profile.birthday).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "",
  };

  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street_address: "",
    state: "",
    closest_landmark: "",
    postal_code: "",
  });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.put("/customer/change-password", passwordData);
      setShowPasswordModal(false);
      setPasswordData({ current_password: "", new_password: "" });
      alert("Password changed successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    )
      return;
    setError("");
    setLoading(true);
    try {
      await api.put("/customer/delete-account", { password: deletePassword });
      logout();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (editingAddress) {
        await api.put(`/customer/addresses/${editingAddress.id}`, addressForm);
      } else {
        await api.post("/customer/addresses", addressForm);
      }
      const { data } = await api.get("/customer/addresses");
      setAddresses(Array.isArray(data) ? data : []);
      setShowAddressModal(false);
      setEditingAddress(null);
      setAddressForm({
        street_address: "",
        state: "",
        closest_landmark: "",
        postal_code: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await api.delete(`/customer/addresses/${id}`);
      const { data } = await api.get("/customer/addresses");
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete address");
    }
  };

  // ── Shared currency formatter ──────────────────────────────────────────────
  const ngn = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(Math.ceil(Number(amount)));

  return (
    <div className="bg-gray-50">
      <main className="px-4 md:px-6 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-3 md:p-4">
              <nav className="space-y-1">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "orders", label: "Orders" },
                  { key: "profile", label: "Profile & Address" },
                  { key: "loyalty", label: "Loyalty & Rewards" },
                  { key: "settings", label: "Settings" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => key !== "loyalty" && setActiveTab(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${
                      activeTab === key
                        ? "bg-orange-50 text-orange-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center ${activeTab === key ? "bg-orange-100" : "bg-gray-100"}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${activeTab === key ? "bg-orange-500" : "bg-gray-400"}`}
                      />
                    </span>
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <section className="lg:col-span-9 space-y-6">
            {/* ── Overview ── */}
            {activeTab === "overview" && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    {
                      icon: FiPackage,
                      bg: "bg-orange-50 text-orange-600",
                      value: overview?.total_orders || 0,
                      label: "Total Orders",
                    },
                    {
                      icon: FiTrendingUp,
                      bg: "bg-emerald-50 text-emerald-600",
                      value: ngn(overview?.total_spent || 0),
                      label: "Total Spent",
                    },
                    {
                      icon: FiStar,
                      bg: "bg-gray-50 text-gray-600",
                      value: overview?.loyalty_points || 0,
                      label: "Loyalty Points",
                    },
                    {
                      icon: FiAward,
                      bg: "bg-indigo-50 text-indigo-600",
                      value: overview?.member_tier || "None",
                      label: "Member Tier",
                    },
                  ].map(({ icon: Icon, bg, value, label }) => (
                    <div
                      key={label}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${bg}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{value}</h3>
                          <p className="text-xs text-gray-500">{label}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="p-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recent Orders</h2>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    >
                      <span>View All</span>
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="px-6 pb-6 space-y-3">
                    {orders.slice(0, 3).map((o) => (
                      <OrderCard
                        key={o.id}
                        order={o}
                        ngn={ngn}
                        onView={() => {
                          setSelectedOrder(o);
                          setShowOrderModal(true);
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold">Quick Actions</h2>
                  </div>
                  <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                      to="/menu"
                      className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4 hover:bg-gray-50"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center">
                        <FiShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Order Again</div>
                        <div className="text-xs text-gray-500">
                          Browse our menu
                        </div>
                      </div>
                    </Link>
                    <Link
                      to="/loyalty-board"
                      className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4 hover:bg-gray-50"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center">
                        <FiGift className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Rewards</div>
                        <div className="text-xs text-gray-500">
                          View your points
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* ── Orders ── */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-semibold">Order History</h2>
                </div>
                <div className="px-6 pb-6 space-y-4">
                  {orders.map((o) => (
                    <OrderCard
                      key={o.id}
                      order={o}
                      ngn={ngn}
                      onView={() => {
                        setSelectedOrder(o);
                        setShowOrderModal(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Profile ── */}
            {activeTab === "profile" && (
              <>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="p-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      Personal Information
                    </h2>
                    <button
                      onClick={() => navigate("/account/edit-profile")}
                      className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 text-xs hover:bg-gray-50"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="px-6 pb-6 space-y-4">
                    {[
                      { icon: FiMail, label: "Email", value: personal.email },
                      { icon: FiPhone, label: "Phone", value: personal.phone },
                      {
                        icon: FiCalendar,
                        label: "Birthday",
                        value: personal.birthday,
                      },
                    ].map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="bg-gray-100 rounded-xl p-4 flex items-center gap-3"
                      >
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="text-xs text-gray-500">{label}</div>
                          <div className="text-sm text-gray-900">
                            {value || "Not provided"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="p-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Saved Addresses</h2>
                    <button
                      onClick={() => {
                        setShowAddressModal(true);
                        setEditingAddress(null);
                        setAddressForm({
                          street_address: "",
                          state: "",
                          closest_landmark: "",
                          postal_code: "",
                        });
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs hover:bg-orange-600"
                    >
                      <FiMapPin className="w-4 h-4" />
                      <span>Add New</span>
                    </button>
                  </div>
                  <div className="px-6 pb-6 space-y-3">
                    {addresses.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No addresses saved yet.
                      </p>
                    )}
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="rounded-2xl border border-gray-100 p-5 relative"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-sm font-semibold">Address</div>
                        </div>
                        <div className="flex gap-2 absolute top-5 right-5">
                          <button
                            onClick={() => {
                              setEditingAddress(addr);
                              setAddressForm(addr);
                              setShowAddressModal(true);
                            }}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-sm text-gray-700 leading-6">
                          <div>{addr.street_address}</div>
                          <div>{addr.state}</div>
                          <div>{addr.closest_landmark}</div>
                          <div>{addr.postal_code}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── Settings ── */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-semibold">Account Settings</h2>
                </div>
                <div className="px-6 pb-6 space-y-3">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 transition-colors"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full bg-red-50 hover:bg-red-100 rounded-xl px-4 py-3 text-sm text-red-600 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ── Change Password Modal ── */}
      {showPasswordModal && (
        <ModalWrapper
          onClose={() => {
            setShowPasswordModal(false);
            setError("");
            setPasswordData({ current_password: "", new_password: "" });
          }}
        >
          <form onSubmit={handleChangePassword}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold">Change Password</h3>
            </div>
            <div className="p-6 space-y-4">
              {error && <ErrorBanner message={error} />}
              {[
                { label: "Current Password", key: "current_password" },
                { label: "New Password", key: "new_password" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    type="password"
                    value={passwordData[key]}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        [key]: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setError("");
                  setPasswordData({ current_password: "", new_password: "" });
                }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* ── Delete Account Modal ── */}
      {showDeleteModal && (
        <ModalWrapper
          onClose={() => {
            setShowDeleteModal(false);
            setError("");
            setDeletePassword("");
          }}
        >
          <form onSubmit={handleDeleteAccount}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-red-600">Delete Account</h3>
              <p className="text-sm text-gray-600 mt-2">
                This action cannot be undone. Please enter your password to
                confirm.
              </p>
            </div>
            <div className="p-6 space-y-4">
              {error && <ErrorBanner message={error} />}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setError("");
                  setDeletePassword("");
                }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* ── Address Modal ── */}
      {showAddressModal && (
        <ModalWrapper
          onClose={() => {
            setShowAddressModal(false);
            setError("");
            setEditingAddress(null);
            setAddressForm({
              street_address: "",
              state: "",
              closest_landmark: "",
              postal_code: "",
            });
          }}
        >
          <form onSubmit={handleSaveAddress}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {error && <ErrorBanner message={error} />}
              {[
                {
                  label: "Street Address",
                  key: "street_address",
                  required: true,
                },
                { label: "State", key: "state", required: true },
                {
                  label: "Closest Landmark",
                  key: "closest_landmark",
                  required: false,
                },
                { label: "Postal Code", key: "postal_code", required: true },
              ].map(({ label, key, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={addressForm[key]}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, [key]: e.target.value })
                    }
                    required={required}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddressModal(false);
                  setError("");
                  setEditingAddress(null);
                  setAddressForm({
                    street_address: "",
                    state: "",
                    closest_landmark: "",
                    postal_code: "",
                  });
                }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Address"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* ── Order Details Modal ── */}
      {showOrderModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          ngn={ngn}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── Generic modal backdrop + card ─────────────────────────────────────────────
const ModalWrapper = ({ onClose, children, wide = false }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div
      className={`bg-white rounded-3xl w-full shadow-xl ${wide ? "max-w-2xl" : "max-w-md"}`}
    >
      {children}
    </div>
  </div>
);

// ── Inline error banner ────────────────────────────────────────────────────────
const ErrorBanner = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm">
    {message}
  </div>
);

// ── Reusable order card (used in both overview and orders tab) ────────────────
const OrderCard = ({ order: o, ngn, onView }) => (
  <div className="rounded-2xl border border-gray-100 p-4">
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{o.order_number}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(o.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {o.order_items?.length || 0} items
        </p>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-orange-500">
          {ngn(o.final_amount)}
        </div>
        <div className="text-xs text-gray-500">
          {o.order_type.charAt(0).toUpperCase() + o.order_type.slice(1)}
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={onView}
            className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 text-xs"
          >
            View Details
          </button>
          <Link
            to="/menu"
            className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs"
          >
            Order Again
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// ── Order Details Modal ───────────────────────────────────────────────────────
const OrderDetailsModal = ({ order: o, ngn, onClose }) => {
  // Corrected totals using the helper functions defined at the top of the file
  const itemsTotal = getOrderItemsTotal(o.order_items);
  const discountAmt = Number(o.discount_amount || 0);
  const deliveryFee = Number(o.delivery_fee || 0);
  const taxAmount = Number(o.tax_amount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10 flex items-center justify-between">
          <h3 className="text-lg font-bold">Order Details</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Order Number", value: o.order_number },
              { label: "Order Type", value: o.order_type, capitalize: true },
              {
                label: "Payment Type",
                value: o.payment_type,
                capitalize: true,
              },
              {
                label: "Date",
                value: new Date(o.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }),
              },
              ...(o.table_number
                ? [{ label: "Table Number", value: o.table_number }]
                : []),
            ].map(({ label, value, capitalize }) => (
              <div key={label}>
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p
                  className={`font-semibold text-sm ${capitalize ? "capitalize" : ""}`}
                >
                  {value}
                </p>
              </div>
            ))}
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Delivery address */}
          {o.delivery_address && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Delivery Address</p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm">{o.delivery_address}</p>
                {(o.delivery_city || o.delivery_zip) && (
                  <p className="text-sm">
                    {[o.delivery_city, o.delivery_zip]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Order items */}
          <div>
            <p className="text-sm font-semibold mb-3">Order Items</p>
            <div className="space-y-3">
              {o.order_items?.map((item) => {
                const itemSubtotal = getItemSubtotal(item);
                const packagingPrice = Number(item.packaging_price ?? 0);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <img
                      src={
                        item.menu?.images?.[0] ||
                        "https://via.placeholder.com/80"
                      }
                      alt={item.menu?.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{item.menu?.name}</p>
                      {/* Unit price × qty */}
                      <p className="text-xs text-gray-500 mt-0.5">
                        {ngn(item.price)} × {item.quantity}
                      </p>
                      {/* Packaging line — only when packaging exists */}
                      {item.packaging && packagingPrice > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5 capitalize">
                          Packaging: {item.packaging.size_name} (+
                          {ngn(packagingPrice)} / item)
                        </p>
                      )}
                    </div>
                    {/* Corrected subtotal = (menu price + packaging price) × qty */}
                    <p className="font-bold text-orange-500 shrink-0">
                      {ngn(itemSubtotal)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Totals breakdown */}
          <div className="border-t pt-4 space-y-2">
            {/* Items total (menu + packaging) */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items Total</span>
              <span className="font-semibold">{ngn(itemsTotal)}</span>
            </div>

            {/* Discount */}
            {discountAmt > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span className="font-semibold">-{ngn(discountAmt)}</span>
              </div>
            )}

            {/* Delivery fee */}
            {deliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">{ngn(deliveryFee)}</span>
              </div>
            )}

            {/* Tax details — rendered per-tax-type from tax_details object */}
            {o.tax_details &&
              Object.entries(o.tax_details).map(([taxName, tax]) => (
                <div key={taxName} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {taxName}{" "}
                    <span className="text-gray-400 text-xs">({tax.rate}%)</span>
                  </span>
                  <span className="font-semibold">{ngn(tax.amount)}</span>
                </div>
              ))}

            {/* Fallback: if tax_details is absent but tax_amount exists */}
            {!o.tax_details && taxAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">{ngn(taxAmount)}</span>
              </div>
            )}

            {/* Final amount — always use the server value */}
            <div className="flex justify-between text-lg font-bold pt-3 border-t">
              <span>Final Amount</span>
              <span className="text-orange-500">{ngn(o.final_amount)}</span>
            </div>
          </div>

          {/* Invoice */}
          {o.invoice && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Invoice Details</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Invoice #:</span>
                  <span className="font-semibold ml-2">
                    {o.invoice.invoice_number}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-semibold ml-2 capitalize">
                    {o.invoice.payment_status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;

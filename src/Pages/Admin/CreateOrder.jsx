import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import {
  FiArrowLeft,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiShoppingCart,
  FiChevronDown,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SearchInput from "../../Components/SearchInput";
import { useSearch } from "../../hooks/useSearch";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const CreateOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);

  // Search functionality
  const {
    searchTerm,
    searchResults,
    isLoading: isSearchLoading,
    error: searchError,
    handleSearchChange,
    clearSearch,
  } = useSearch();
  const [orderType, setOrderType] = useState("dine");
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryZip: "",
  });
  const [paymentMode, setPaymentMode] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [orderAction, setOrderAction] = useState("send_to_kitchen");
  const [posService, setPosService] = useState("opay");
  const [bankAccount, setBankAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);

  // Delivery location state
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [isZonesLoading, setIsZonesLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZone, setSelectedZone] = useState(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15,
  });

  // Packaging state
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [loadingPackaging, setLoadingPackaging] = useState(false);
  const [openPackagingDropdown, setOpenPackagingDropdown] = useState(null);

  // User registration state
  const [userType, setUserType] = useState("unregistered");
  const [userSearchPhone, setUserSearchPhone] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [loadingUserSearch, setLoadingUserSearch] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserDropdown, setOpenUserDropdown] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchPackagingOptions();
    fetchMenus("all", 1);
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const statesRes = await api.get("/states");
      setStates(statesRes.data);
    } catch (err) {
      console.error("Failed to fetch states:", err);
    }
  };

  const handleStateChange = async (stateId) => {
    setSelectedState(stateId);
    setSelectedCity("");
    setSelectedZone(null);
    setCities([]);
    setZones([]);

    if (stateId) {
      setIsCitiesLoading(true);
      try {
        const cityRes = await api.get(`/cities?state_id=${stateId}`);
        setCities(cityRes.data);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      } finally {
        setIsCitiesLoading(false);
      }
    }
  };

  const handleCityChange = async (cityId) => {
    setSelectedCity(cityId);
    setSelectedZone(null);
    setZones([]);

    if (cityId) {
      setIsZonesLoading(true);
      try {
        const zoneRes = await api.get(`/zones?city_id=${cityId}`);
        const activeZones = zoneRes.data.filter((zone) => zone.is_active);
        setZones(activeZones);
      } catch (err) {
        console.error("Failed to fetch zones:", err);
      } finally {
        setIsZonesLoading(false);
      }
    }
  };

  const handleZoneChange = (zoneId) => {
    const zone = zones.find((z) => z.id.toString() === zoneId);
    setSelectedZone(zone || null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-packaging-dropdown]")) {
        setOpenPackagingDropdown(null);
      }
      if (!e.target.closest("[data-user-dropdown]")) {
        setOpenUserDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear packaging when order type changes to dine-in
  useEffect(() => {
    if (orderType === "dine") {
      setCart(
        cart.map((item) => ({
          ...item,
          packaging_id: null,
          packaging: null,
        })),
      );
    }
  }, [orderType]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchMenus = useCallback(async (categoryId = "all", pageNumber = 1) => {
    setMenuLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", pageNumber);
      if (categoryId !== "all") {
        params.set("category_id", categoryId);
      }

      const { data } = await api.get(`/menus?${params.toString()}`);
      const pageData = data.data ?? [];
      setMenus(pageData);
      setPagination({
        current_page: data.current_page ?? pageNumber,
        last_page: data.last_page ?? 1,
        total: data.total ?? pageData.length,
        per_page: data.per_page ?? 15,
      });
    } catch (err) {
      console.error("Failed to fetch menus:", err);
    } finally {
      setMenuLoading(false);
    }
  }, []);

  const fetchPackagingOptions = async () => {
    setLoadingPackaging(true);
    try {
      const { data } = await api.get("/packagings");
      setPackagingOptions(Array.isArray(data) ? data : (data.data ?? []));
    } catch (err) {
      console.error("Failed to fetch packaging options:", err);
    } finally {
      setLoadingPackaging(false);
    }
  };

  const searchUsers = async (phone) => {
    if (!phone.trim()) {
      setUserSearchResults([]);
      return;
    }

    setLoadingUserSearch(true);
    try {
      const { data } = await api.get(`/admin/users?search=${phone.trim()}`);
      setUserSearchResults(data.data || []);
    } catch (err) {
      console.error("Failed to search users:", err);
      setUserSearchResults([]);
    } finally {
      setLoadingUserSearch(false);
    }
  };

  const handleUserSearchChange = (e) => {
    const phone = e.target.value;
    setUserSearchPhone(phone);

    // Clear selected user when phone changes
    if (selectedUser) {
      setSelectedUser(null);
      setFormData({
        ...formData,
        customerName: "",
        customerEmail: "",
      });
    }

    // Clear search results when input changes
    setUserSearchResults([]);
  };

  const handleUserSearch = async () => {
    if (!userSearchPhone.trim()) {
      showToast("Please enter a phone number to search", "error");
      return;
    }

    setLoadingUserSearch(true);
    try {
      const { data } = await api.get(
        `/admin/users?search=${userSearchPhone.trim()}`,
      );
      setUserSearchResults(data.data || []);

      if (data.data?.length === 0) {
        showToast("No users found with that phone number", "error");
      }
    } catch (err) {
      console.error("Failed to search users:", err);
      setUserSearchResults([]);
      showToast("Failed to search users", "error");
    } finally {
      setLoadingUserSearch(false);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setFormData({
      ...formData,
      customerName: user.name,
      customerEmail: user.email,
    });
    setUserSearchPhone(user.phone || "");
    setUserSearchResults([]);
    setOpenUserDropdown(null);
  };

  const clearSelectedUser = () => {
    setSelectedUser(null);
    setUserSearchPhone("");
    setUserSearchResults([]);
    setFormData({
      ...formData,
      customerName: "",
      customerEmail: "",
    });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchMenus(categoryId, 1);
  };

  const handlePageChange = (pageNumber) => {
    fetchMenus(selectedCategory, pageNumber);
  };

  const displayMenus = searchTerm
    ? searchResults
    : selectedCategory === "all"
      ? menus
      : menus.filter((menu) => menu.category_id === selectedCategory);

  const getVisiblePageNumbers = () => {
    const { last_page, current_page } = pagination;

    // Always exclude first and last — they have their own dedicated buttons
    if (last_page <= 2) return [];

    const inner = Array.from({ length: last_page - 2 }, (_, i) => i + 2); // [2 .. last_page-1]

    if (inner.length <= 5) return inner;

    const maxVisible = 4;
    let start = Math.max(2, current_page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > last_page - 1) {
      end = last_page - 1;
      start = Math.max(2, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // ── Cart helpers ────────────────────────────────────────────────────────────

  const addToCart = (menu) => {
    const existing = cart.find((item) => item.menu.id === menu.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.menu.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
      showToast(
        `${menu.name} quantity updated to ${existing.quantity + 1}`,
        "success",
      );
    } else {
      setCart([
        ...cart,
        { menu, quantity: 1, packaging_id: null, packaging: null },
      ]);
      showToast(`${menu.name} added to cart`, "success");
    }
  };

  const updateQuantity = (menuId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.menu.id !== menuId));
    } else {
      setCart(
        cart.map((item) =>
          item.menu.id === menuId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const removeFromCart = (menuId) => {
    setCart(cart.filter((item) => item.menu.id !== menuId));
  };

  const selectPackaging = (menuId, packaging) => {
    setCart(
      cart.map((item) =>
        item.menu.id === menuId
          ? { ...item, packaging_id: packaging.id, packaging }
          : item,
      ),
    );
    setOpenPackagingDropdown(null);
  };

  const clearPackaging = (menuId) => {
    setCart(
      cart.map((item) =>
        item.menu.id === menuId
          ? { ...item, packaging_id: null, packaging: null }
          : item,
      ),
    );
  };

  // ── Totals ──────────────────────────────────────────────────────────────────

  const getItemTotal = (item) =>
    (Number(item.menu.price) + Number(item.packaging?.price ?? 0)) *
    item.quantity;

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + getItemTotal(item), 0);

  // ── Checkout ────────────────────────────────────────────────────────────────

  const handleCheckout = async () => {
    // Validate user selection
    if (userType === "registered" && !selectedUser) {
      showToast("Please select a registered user", "error");
      return;
    }

    if (
      orderType === "delivery" &&
      (!formData.customerPhone || !formData.deliveryAddress || !selectedZone)
    ) {
      showToast("Please fill in all delivery details including zone", "error");
      return;
    }

    if (cart.length === 0) {
      showToast("Cart is empty", "error");
      return;
    }

    if (orderType !== "dine" && cart.some((item) => !item.packaging_id)) {
      showToast("Please select packaging for all items", "error");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        order_type: orderType,
        items: cart.map((item) => ({
          menu_id: item.menu.id,
          quantity: item.quantity,
          packaging_id: item.packaging_id ?? null,
        })),
      };

      // Add user ID if registered user is selected
      if (userType === "registered" && selectedUser) {
        orderData.customer_user_id = selectedUser.id;
      }

      if (paymentStatus === "ready") {
        orderData.payment_type = paymentMode;
        orderData.action = orderAction;

        // Add POS service and bank account details
        if (paymentMode === "pos") {
          orderData.pos_service = posService;
        } else if (paymentMode === "transfer") {
          orderData.bank_account = bankAccount;
        }
      }

      if (orderType === "delivery") {
        const city = cities.find((c) => c.id.toString() === selectedCity);
        orderData.customer_phone = formData.customerPhone;
        orderData.delivery_address = formData.deliveryAddress;
        orderData.delivery_city = city?.name || "";
        orderData.delivery_zone_id = selectedZone.id;
      }

      await api.post("/checkout", orderData);
      showToast("Order created successfully!", "success");

      const p =
        user.role === "admin"
          ? "/admin"
          : user.role === "supervisor"
            ? "/supervisor"
            : "/attendant";
      navigate(`${p}/orders`);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to create order",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6 bg-gray-50/50 min-h-full max-w-full overflow-x-hidden">
        <button
          onClick={() => {
            if (user.role === "attendant") {
              navigate("/attendant/orders");
            }
            if (user.role === "admin") {
              navigate("/admin/orders");
            }
            if (user.role === "supervisor") {
              navigate("/supervisor/orders");
            }
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <FiArrowLeft />
          <span>Back to Orders</span>
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
          <p className="text-sm text-gray-500 mt-1">
            Add items and customer details
          </p>
        </div>

        {/* Mobile Cart Icon - Only visible on mobile screens for staff users */}
        {(user.role === "attendant" ||
          user.role === "admin" ||
          user.role === "supervisor") &&
          cart.length > 0 && (
            <button
              onClick={() => {
                const cartSection = document.getElementById("cart-section");
                if (cartSection) {
                  cartSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="lg:hidden fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-200 z-40 flex items-center gap-2"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span className="bg-white text-orange-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </button>
          )}

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6 max-w-full">
          {/* ── Menu panel ── */}
          <div className="lg:col-span-2 space-y-4 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6 overflow-hidden min-w-0">
              <h2 className="text-lg font-bold text-gray-900 mb-3 lg:mb-4">
                Menu Items
              </h2>

              {/* Search Input */}
              <div className="mb-3 lg:mb-4">
                <SearchInput
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClear={clearSearch}
                  isLoading={isSearchLoading}
                  placeholder="Search menu items..."
                />
              </div>

              {/* Category tabs */}
              <div className="mb-3 lg:mb-4 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === "all"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Menu grid */}
              {menuLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                  <p className="text-sm text-gray-400 font-medium">
                    Loading Menu...
                  </p>
                </div>
              ) : displayMenus.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  {searchTerm && isSearchLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                      <p>Searching...</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {searchTerm
                        ? "This item does not exist"
                        : "No items found in this category."}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                    {displayMenus.map((menu) => (
                      <div
                        key={menu.id}
                        className="border border-gray-200 rounded-xl hover:border-orange-500 transition-colors"
                      >
                        <div className="flex gap-3 p-3 min-w-0">
                          {menu.images && menu.images.length > 0 && (
                            <img
                              src={menu.images[0]}
                              alt={menu.name}
                              className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg flex-shrink-0"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/80x80";
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 text-xs lg:text-sm truncate flex-1 min-w-0">
                                {menu.name}
                              </h3>
                              <span className="text-xs lg:text-sm font-bold text-orange-500 whitespace-nowrap flex-shrink-0">
                                ₦
                                {Number(menu.price).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                              {menu.description}
                            </p>
                            <button
                              onClick={() => addToCart(menu)}
                              className="w-full px-3 py-1.5 lg:py-2 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={menu.stock_quantity < 1}
                            >
                              {menu.stock_quantity < 1
                                ? "Out of Stock"
                                : "Add To Cart"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.last_page > 1 && (
                    <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-w-0 overflow-x-hidden">
                      <p className="text-xs text-gray-400 order-2 sm:order-1 truncate">
                        Page {pagination.current_page} of {pagination.last_page}{" "}
                        &mdash; {pagination.total} items
                      </p>
                      <div className="flex items-center gap-1 flex-wrap order-1 sm:order-2 w-full sm:w-auto justify-center sm:justify-start overflow-x-auto">
                        <button
                          disabled={pagination.current_page === 1}
                          onClick={() =>
                            handlePageChange(pagination.current_page - 1)
                          }
                          className="px-3 py-2 lg:py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed min-w-[60px]"
                        >
                          Prev
                        </button>

                        {/* First page */}
                        <button
                          onClick={() => handlePageChange(1)}
                          className={`px-3 py-2 lg:py-1.5 rounded-lg text-xs font-medium border transition-colors min-w-[44px] ${
                            pagination.current_page === 1
                              ? "bg-orange-500 text-white border-orange-500"
                              : "border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          1
                        </button>

                        {/* Left ellipsis */}
                        {getVisiblePageNumbers()[0] > 2 && (
                          <span className="px-1 text-xs text-gray-400">…</span>
                        )}

                        {/* Middle pages */}
                        {getVisiblePageNumbers().map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 lg:py-1.5 rounded-lg text-xs font-medium border transition-colors min-w-[44px] ${
                              pagination.current_page === pageNum
                                ? "bg-orange-500 text-white border-orange-500"
                                : "border-gray-200 text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        {/* Right ellipsis */}
                        {getVisiblePageNumbers().slice(-1)[0] <
                          pagination.last_page - 1 && (
                          <span className="px-1 text-xs text-gray-400">…</span>
                        )}

                        {/* Last page */}
                        {pagination.last_page > 1 && (
                          <button
                            onClick={() =>
                              handlePageChange(pagination.last_page)
                            }
                            className={`px-3 py-2 lg:py-1.5 rounded-lg text-xs font-medium border transition-colors min-w-[44px] ${
                              pagination.current_page === pagination.last_page
                                ? "bg-orange-500 text-white border-orange-500"
                                : "border-gray-200 text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {pagination.last_page}
                          </button>
                        )}

                        <button
                          disabled={
                            pagination.current_page === pagination.last_page
                          }
                          onClick={() =>
                            handlePageChange(pagination.current_page + 1)
                          }
                          className="px-3 py-2 lg:py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed min-w-[60px]"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4 min-w-0">
            {/* Cart */}
            <div
              id="cart-section"
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6 min-w-0"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-3 lg:mb-4 flex items-center gap-2">
                <FiShoppingCart />
                Cart ({cart.length})
              </h2>

              {cart.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6 lg:py-8">
                  Cart is empty
                </p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.menu.id}
                      className="p-3 bg-gray-50 rounded-xl space-y-3 min-w-0"
                    >
                      {/* Item row */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {item.menu.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₦
                            {Number(item.menu.price).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() =>
                              updateQuantity(item.menu.id, item.quantity - 1)
                            }
                            className="p-1.5 hover:bg-gray-200 rounded touch-manipulation"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.menu.id, item.quantity + 1)
                            }
                            className="p-1.5 hover:bg-gray-200 rounded touch-manipulation"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.menu.id)}
                            className="p-1.5 hover:bg-red-50 text-red-500 rounded ml-1 touch-manipulation"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Packaging dropdown */}
                      {orderType !== "dine" && (
                        <div className="relative" data-packaging-dropdown>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenPackagingDropdown(
                                openPackagingDropdown === item.menu.id
                                  ? null
                                  : item.menu.id,
                              )
                            }
                            disabled={loadingPackaging}
                            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 touch-manipulation ${
                              item.packaging
                                ? "border-orange-300 bg-orange-50 text-orange-700"
                                : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                            } disabled:opacity-60 disabled:cursor-not-allowed`}
                          >
                            <span className="truncate">
                              {loadingPackaging
                                ? "Loading packaging…"
                                : item.packaging
                                  ? `${item.packaging.size_name} — ₦${Number(
                                      item.packaging.price,
                                    ).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}`
                                  : "Select packaging"}
                            </span>
                            <FiChevronDown
                              className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                                openPackagingDropdown === item.menu.id
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>

                          {openPackagingDropdown === item.menu.id && (
                            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto left-0 right-0">
                              {packagingOptions.length === 0 ? (
                                <p className="px-3 py-3 text-xs text-gray-400 text-center">
                                  No packaging options available.
                                </p>
                              ) : (
                                packagingOptions.map((pkg) => (
                                  <button
                                    key={pkg.id}
                                    type="button"
                                    onClick={() =>
                                      selectPackaging(item.menu.id, pkg)
                                    }
                                    className={`w-full px-3 py-3 text-left flex items-center justify-between hover:bg-orange-50 transition-colors touch-manipulation ${
                                      item.packaging?.id === pkg.id
                                        ? "bg-orange-50"
                                        : ""
                                    }`}
                                  >
                                    <span className="text-xs font-medium text-gray-700 capitalize">
                                      {pkg.size_name}
                                    </span>
                                    <span className="text-xs font-bold text-orange-500 ml-3 shrink-0">
                                      +₦
                                      {Number(pkg.price).toLocaleString(
                                        undefined,
                                        {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        },
                                      )}
                                    </span>
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Per-item total */}
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-xs text-gray-400">
                          Item total
                        </span>
                        <span className="text-xs font-bold text-gray-700">
                          ₦
                          {getItemTotal(item).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-orange-500">
                        ₦
                        {calculateTotal().toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order details form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6 overflow-hidden min-w-0">
              <h2 className="text-lg font-bold text-gray-900 mb-3 lg:mb-4">
                Order Details
              </h2>
              <div className="space-y-3 lg:space-y-4">
                {/* User Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Type
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="registered"
                        checked={userType === "registered"}
                        onChange={(e) => {
                          setUserType(e.target.value);
                          clearSelectedUser();
                        }}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-300 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        Registered User
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="unregistered"
                        checked={userType === "unregistered"}
                        onChange={(e) => {
                          setUserType(e.target.value);
                          clearSelectedUser();
                        }}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-300 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        Unregistered User
                      </span>
                    </label>
                  </div>
                </div>

                {/* User Search for Registered Users */}
                {userType === "registered" && (
                  <div className="relative" data-user-dropdown>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Registered User
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="tel"
                          value={userSearchPhone}
                          onChange={handleUserSearchChange}
                          placeholder="Enter user phone number..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleUserSearch}
                        disabled={loadingUserSearch || !userSearchPhone.trim()}
                        className="px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex items-center gap-2"
                      >
                        {loadingUserSearch ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Searching...
                          </>
                        ) : (
                          "Search"
                        )}
                      </button>
                    </div>

                    {/* User Search Results Dropdown */}
                    {userSearchResults.length > 0 && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto left-0 right-0">
                        {userSearchResults.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => selectUser(user)}
                            className="w-full px-3 py-3 text-left flex items-center justify-between hover:bg-orange-50 transition-colors touch-manipulation border-b border-gray-50 last:border-b-0"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {user.phone || "No phone number"}
                              </p>
                              {user.email && (
                                <p className="text-xs text-gray-400 truncate">
                                  {user.email}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              {user.loyalty_points > 0 && (
                                <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">
                                  {user.loyalty_points} pts
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Selected User Display */}
                {selectedUser && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {selectedUser.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {selectedUser.email}
                        </p>
                        {selectedUser.phone && (
                          <p className="text-xs text-gray-500 truncate">
                            {selectedUser.phone}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={clearSelectedUser}
                        className="p-1.5 hover:bg-orange-100 text-orange-600 rounded-lg touch-manipulation ml-2"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Type
                  </label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                  >
                    <option value="dine">Dine-in</option>
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="ready">Ready to Pay</option>
                  </select>
                </div>

                {paymentStatus === "ready" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Mode
                      </label>
                      <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                      >
                        <option value="cash">Cash</option>
                        <option value="pos">POS</option>
                        <option value="transfer">Transfer</option>
                      </select>
                    </div>

                    {paymentMode === "pos" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          POS Service
                        </label>
                        <select
                          value={posService}
                          onChange={(e) => setPosService(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                        >
                          <option value="OPay">OPay</option>
                        </select>
                      </div>
                    )}

                    {paymentMode === "transfer" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Account
                        </label>
                        <select
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                        >
                          <option value="OPayFirst">OPay - 6550510874</option>
                          <option value="OPaySecond">OPay - 6425460090</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Action
                      </label>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="orderAction"
                            value="complete"
                            checked={orderAction === "complete"}
                            onChange={(e) => setOrderAction(e.target.value)}
                            className="w-4 h-4 text-orange-500 focus:ring-orange-300 border-gray-300"
                          />
                          <span className="text-sm text-gray-700">
                            Complete Order
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="orderAction"
                            value="send_to_kitchen"
                            checked={orderAction === "send_to_kitchen"}
                            onChange={(e) => setOrderAction(e.target.value)}
                            className="w-4 h-4 text-orange-500 focus:ring-orange-300 border-gray-300"
                          />
                          <span className="text-sm text-gray-700">
                            Send to Kitchen
                          </span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {orderType === "delivery" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerPhone: e.target.value,
                          })
                        }
                        placeholder="+234 800 000 0000"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <select
                        value={selectedState}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => handleCityChange(e.target.value)}
                        disabled={!selectedState || isCitiesLoading}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none disabled:opacity-50"
                      >
                        <option value="">
                          {isCitiesLoading
                            ? "Loading cities..."
                            : "Select City"}
                        </option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zone
                      </label>
                      <select
                        value={selectedZone?.id || ""}
                        onChange={(e) => handleZoneChange(e.target.value)}
                        disabled={!selectedCity || isZonesLoading}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none disabled:opacity-50"
                      >
                        <option value="">
                          {isZonesLoading ? "Loading zones..." : "Select Zone"}
                        </option>
                        {zones.map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            deliveryAddress: e.target.value,
                          })
                        }
                        placeholder="Street address, building, etc."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={
                    loading ||
                    cart.length === 0 ||
                    (orderType !== "dine" &&
                      cart.some((item) => !item.packaging_id))
                  }
                  className="w-full px-4 py-3 lg:py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  {loading ? "Creating Order..." : "Create Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateOrder;

import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { checkWorkingHourAvailability } from "../../utils/checkWorkingHours";
import WorkingHoursClosedModal from "../Modals/WorkingHoursInfoModal";
import SearchInput from "../SearchInput";
import { useSearch } from "../../hooks/useSearch";

function MenuItems() {
  const [activeTab, setActiveTab] = useState("all");
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
    per_page: 15,
  });
  const [closedModal, setClosedModal] = useState({
    open: false,
    message: "",
    schedule: [],
  });
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [isLoadingOutlets, setIsLoadingOutlets] = useState(false);
  const [outletsError, setOutletsError] = useState(null);
  const [menuError, setMenuError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);

  const { addToCart, loadingItems, clearCart } = useCart();
  const { showToast } = useToast();

  // Fetch outlets
  const fetchOutlets = async () => {
    setIsLoadingOutlets(true);
    setOutletsError(null);
    try {
      const { data } = await api.get("/outlets");
      setOutlets(data);
    } catch (err) {
      console.error("Failed to fetch outlets:", err);
      setOutletsError(err.message || "Failed to load outlets");
    } finally {
      setIsLoadingOutlets(false);
    }
  };

  // Search functionality
  const {
    searchTerm,
    searchResults,
    isLoading: isSearchLoading,
    error: searchError,
    handleSearchChange,
    clearSearch,
  } = useSearch();

  // Display logic for menu items
  const displayItems = searchTerm ? searchResults : menuItems;

  // Fetch categories separately
  const fetchCategories = async () => {
    setCategoriesError(null);
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategoriesError(err.message || "Failed to load categories");
    }
  };

  // Fetches categories + first page of menu items in parallel on mount
  const fetchInitialData = async () => {
    setIsLoading(true);
    setMenuError(null);
    setCategoriesError(null);
    try {
      // Fetch categories separately to handle errors individually
      fetchCategories();

      const menuRes = await api.get("/menus?page=1");
      const pageData = menuRes.data.data ?? [];
      setMenuItems(pageData);
      setPagination({
        current_page: menuRes.data.current_page ?? 1,
        last_page: menuRes.data.last_page ?? 1,
        total: menuRes.data.total ?? pageData.length,
        from: menuRes.data.from ?? (pageData.length ? 1 : 0),
        to: menuRes.data.to ?? pageData.length,
        per_page: menuRes.data.per_page ?? 15,
      });
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
      setMenuError(err.message || "Failed to load menu");
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Fetches menu items when tab or page changes (after initial load)
  const fetchMenuItems = useCallback(
    async (categoryId = "all", pageNumber = 1) => {
      setIsLoading(true);
      setMenuError(null);
      try {
        const params = new URLSearchParams();
        params.set("page", pageNumber);
        if (categoryId !== "all") {
          params.set("category_id", categoryId);
        }
        if (selectedOutlet) {
          params.set("outlet_id", selectedOutlet);
        }

        const { data } = await api.get(`/menus?${params.toString()}`);

        const pageData = data.data ?? [];
        setMenuItems(pageData);
        setPagination({
          current_page: data.current_page ?? pageNumber,
          last_page: data.last_page ?? 1,
          total: data.total ?? pageData.length,
          from: data.from ?? (pageData.length ? 1 : 0),
          to: data.to ?? pageData.length,
          per_page: data.per_page ?? 15,
        });
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
        setMenuError(err.message || "Failed to load menu");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedOutlet],
  );

  // Runs once on mount — fetches both simultaneously
  useEffect(() => {
    fetchInitialData();
    fetchOutlets();
  }, []);

  // Runs when tab, page, or outlet changes, skipping the very first render
  useEffect(() => {
    if (isInitialLoad) return;
    fetchMenuItems(activeTab, page);
  }, [activeTab, page, selectedOutlet]);

  // Reset to page 1 when changing outlet (after initial load)
  useEffect(() => {
    if (isInitialLoad) return;
    setPage(1);
  }, [selectedOutlet]);

  // Reset to page 1 when switching tabs (after initial load)
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(1);
  };

  const getVisiblePageNumbers = () => {
    const totalPages = pagination.last_page;
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const current = pagination.current_page;
    const maxPages = 6;
    let start = Math.max(2, current - Math.floor(maxPages / 2));
    let end = start + maxPages - 1;

    if (end > totalPages - 1) {
      end = totalPages - 1;
      start = Math.max(2, end - maxPages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  };

  const handleAddToCart = async (item) => {
    const { available, message, schedule } =
      await checkWorkingHourAvailability();

    if (!available) {
      setClosedModal({ open: true, message, schedule });
      return;
    }

    const result = await addToCart(item.id, 1);
    if (result) {
      showToast(`${item.name} added to cart!`, "success");
    } else {
      showToast("Failed to add to cart", "error");
    }
  };

  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Search Input */}
        <div className="mb-8">
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={clearSearch}
            isLoading={isSearchLoading}
            placeholder="Search menu items..."
          />
        </div>

        {/* Outlet Selector */}
        <div className="mb-8">
          {isLoadingOutlets ? (
            <div className="flex items-center gap-2">
              <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          ) : outletsError ? (
            <div className="flex flex-col gap-2">
              <p className="text-red-500 text-sm">{outletsError}</p>
              <button
                onClick={fetchOutlets}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors w-fit"
              >
                Retry
              </button>
            </div>
          ) : (
            <select
              value={selectedOutlet || ""}
              onChange={(e) => {
                const newOutlet = e.target.value || null;
                if (newOutlet !== selectedOutlet) {
                  clearCart();
                }
                setSelectedOutlet(newOutlet);
              }}
              className="bg-white text-black px-4 py-2 rounded-lg font-medium w-full md:w-64 border border-gray-200"
            >
              <option value="">All Outlets</option>
              {outlets.map((outlet) => (
                <option key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Category tabs — skeleton pills while loading, real buttons after */}
        <div className="flex gap-3 mb-12 flex-wrap">
          {isLoading && isInitialLoad ? (
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
              />
            ))
          ) : categoriesError ? (
            <div className="flex flex-col gap-2">
              <p className="text-red-500 text-sm">{categoriesError}</p>
              <button
                onClick={fetchCategories}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors w-fit"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleTabChange("all")}
                className={`px-6 py-1 rounded-full font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleTabChange(cat.id)}
                  className={`px-6 py-1 rounded-full font-medium transition-colors ${
                    activeTab === cat.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Spinner for all loading states */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm font-medium tracking-wide">
              Loading Menu...
            </p>
          </div>
        ) : menuError ? (
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center gap-4 py-20">
              <p className="text-red-500 text-sm">{menuError}</p>
              <button
                onClick={() => fetchMenuItems(activeTab, page)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {displayItems.length === 0 ? (
                <div className="col-span-full text-center py-16 text-gray-400 text-sm">
                  {searchTerm && isSearchLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                      <p>Searching...</p>
                    </div>
                  ) : searchTerm ? (
                    "This item does not exist"
                  ) : (
                    "No menu items found."
                  )}
                </div>
              ) : (
                displayItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full"
                  >
                    <img
                      src={
                        item.images?.[0] ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={item.name}
                      className="w-full h-48 object-cover flex-shrink-0"
                    />
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <span className="text-orange-500 font-black text-xl">
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                            minimumFractionDigits: 0,
                          }).format(item.price)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                        {item.description}
                      </p>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={
                          item.stock_quantity < 1 || loadingItems[item.id]
                        }
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-bold transition-colors disabled:opacity-50 mt-auto"
                      >
                        {loadingItems[item.id]
                          ? "Adding..."
                          : item.stock_quantity < 1
                            ? "Out of Stock"
                            : "Add To Cart"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!searchTerm && pagination.last_page > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  disabled={pagination.current_page === 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.current_page === 1}
                  onClick={() => setPage(1)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                {getVisiblePageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 transition-colors ${
                      pagination.current_page === pageNumber
                        ? "bg-orange-500 text-white border-orange-500"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => setPage(pagination.last_page)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
                <button
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() =>
                    setPage((prev) => Math.min(pagination.last_page, prev + 1))
                  }
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <WorkingHoursClosedModal
        isOpen={closedModal.open}
        message={closedModal.message}
        schedule={closedModal.schedule}
        onClose={() =>
          setClosedModal({ open: false, message: "", schedule: [] })
        }
      />
    </div>
  );
}

export default MenuItems;

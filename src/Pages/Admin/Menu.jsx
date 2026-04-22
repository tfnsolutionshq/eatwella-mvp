import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import AddCategoryModal from "../../Components/Modals/AddCategoryModal";
import EditCategoryModal from "../../Components/Modals/EditCategoryModal";
import AddMenuItemModal from "../../Components/Modals/AddMenuItemModal";
import EditMenuItemModal from "../../Components/Modals/EditMenuItemModal";
import {
  FiPlus,
  FiFolderPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import api from "../../utils/api";

const Menu = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);
  const [isEditMenuItemOpen, setIsEditMenuItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Numbered pagination state (mirrors MenuItems.jsx)
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
    per_page: 15,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // ── Initial load — categories + first page of menu items in parallel ──────

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [categoriesRes, menuRes] = await Promise.all([
          api.get("/admin/categories"),
          api.get("/admin/menus?page=1"),
        ]);

        // Full list fetch for modals — needs total from first response
        const allMenuRes = await api.get(
          `/admin/menus?per_page=${menuRes.data.total}`,
        );

        setCategories(categoriesRes.data.data);
        setAllMenuItems(allMenuRes.data.data);

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
        console.error("Failed to fetch initial data:", err);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };
    fetchInitialData();
  }, []);

  // ── Tab/page change fetches (skips very first render) ─────────────────────

  const fetchMenuItems = useCallback(
    async (categoryId = "all", pageNumber = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", pageNumber);
        if (categoryId !== "all") {
          params.set("category_id", categoryId);
        }

        const { data } = await api.get(`/admin/menus?${params.toString()}`);

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
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (isInitialLoad) return;
    fetchMenuItems(activeTab, page);
  }, [activeTab, page]);

  // ── Standalone refetch helpers (called after mutations) ───────────────────

  const refetchCategories = async () => {
    try {
      const { data } = await api.get("/admin/categories");
      setCategories(data.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // const refetchMenuItems = async () => {
  //   try {
  //     const firstResponse = await api.get(
  //       `/admin/menus?page=${pagination.current_page}`,
  //     );
  //     const allMenuRes = await api.get(
  //       `/admin/menus?per_page=${firstResponse.data.total}`,
  //     );
  //     const pageData = firstResponse.data.data ?? [];
  //     setMenuItems(pageData);
  //     setAllMenuItems(allMenuRes.data.data);
  //     setPagination({
  //       current_page:
  //         firstResponse.data.current_page ?? pagination.current_page,
  //       last_page: firstResponse.data.last_page ?? 1,
  //       total: firstResponse.data.total ?? pageData.length,
  //       from: firstResponse.data.from ?? (pageData.length ? 1 : 0),
  //       to: firstResponse.data.to ?? pageData.length,
  //       per_page: firstResponse.data.per_page ?? 15,
  //     });
  //   } catch (err) {
  //     console.error("Failed to fetch menu items:", err);
  //   }
  // };

  const refetchMenuItems = async () => {
    await fetchMenuItems(activeTab, pagination.current_page);

    // Still fetch full list for modals
    try {
      const { data } = await api.get(
        `/admin/menus?per_page=${pagination.total}`,
      );
      setAllMenuItems(data.data);
    } catch (err) {
      console.error("Failed to fetch all menu items:", err);
    }
  };

  const fetchSingleMenuItem = async (itemId) => {
    try {
      const data = await api.get(`/menus/${itemId}`);
      return data.data;
    } catch (err) {
      console.error("Failed to fetch menu item details: ", err);
    }
  };

  // ── Tab switching ─────────────────────────────────────────────────────────

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(1);
  };

  // ── Pagination helpers ────────────────────────────────────────────────────

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

  // ── Mutation handlers ─────────────────────────────────────────────────────

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      refetchCategories();
      if (activeTab === id) handleTabChange("all");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/admin/menus/${id}`);
      refetchMenuItems();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete item");
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await api.put(`/admin/menus/${item.id}`, {
        is_available: item.is_available ? 0 : 1,
      });
      refetchMenuItems();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update item");
    }
  };

  const filteredItems =
    activeTab === "all"
      ? menuItems
      : menuItems.filter((item) => item.category_id === activeTab);

  return (
    <>
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSuccess={refetchCategories}
      />
      <EditCategoryModal
        isOpen={isEditCategoryOpen}
        onClose={() => {
          setIsEditCategoryOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSuccess={refetchCategories}
      />
      <AddMenuItemModal
        isOpen={isAddMenuItemOpen}
        onClose={() => setIsAddMenuItemOpen(false)}
        categories={categories}
        onSuccess={refetchMenuItems}
        menuItems={allMenuItems}
      />
      <EditMenuItemModal
        isOpen={isEditMenuItemOpen}
        onClose={() => {
          setIsEditMenuItemOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        categories={categories}
        onSuccess={refetchMenuItems}
        menuItems={allMenuItems}
      />

      <DashboardLayout>
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Menu Management
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiFolderPlus className="w-4 h-4" />
                Add Category
              </button>
              <button
                onClick={() => setIsAddMenuItemOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
              >
                <FiPlus className="w-4 h-4" />
                Add Menu Item
              </button>
            </div>
          </div>

          {/* Filter Tabs — skeleton pills while loading, real tabs after */}
          <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {isLoading && isInitialLoad ? (
                <>
                  <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse" />
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"
                    />
                  ))}
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleTabChange("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === "all"
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    All Items
                  </button>
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-1">
                      <button
                        onClick={() => handleTabChange(cat.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === cat.id
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {cat.name}
                      </button>
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsEditCategoryOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Menu Grid — spinner while loading, grid after */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm font-medium tracking-wide">
                Loading Menu...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.length === 0 ? (
                  <div className="col-span-full text-center py-16 text-gray-400 text-sm">
                    No menu items found.
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={
                            item.images && item.images.length > 0
                              ? item.images[0]
                              : "https://via.placeholder.com/400x300"
                          }
                          alt={item.name}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x300";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span
                          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm ${
                            item.is_available ? "bg-green-500" : "bg-gray-500"
                          }`}
                        >
                          {item.is_available ? "Available" : "Unavailable"}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3
                            className="text-lg font-bold text-gray-900 line-clamp-1"
                            title={item.name}
                          >
                            {item.name}
                          </h3>
                          <span className="text-lg font-bold text-orange-500">
                            {new Intl.NumberFormat("en-NG", {
                              style: "currency",
                              currency: "NGN",
                              minimumFractionDigits: 0,
                            }).format(Math.ceil(item.price))}
                          </span>
                        </div>

                        <p
                          className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1"
                          title={item.description}
                        >
                          {item.description}
                        </p>

                        <div className="flex items-center gap-2 mb-6">
                          <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                            {item.category?.name}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                          >
                            {item.is_available ? (
                              <>
                                <FiEyeOff className="w-4 h-4" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <FiEye className="w-4 h-4" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={async () => {
                              const itemDetails = await fetchSingleMenuItem(
                                item.id,
                              );
                              if (itemDetails) {
                                setEditingItem(itemDetails);
                                setIsEditMenuItemOpen(true);
                              }
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Numbered pagination (mirrors MenuItems.jsx) */}
              {pagination.last_page > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
                  <div className="text-sm text-gray-500">
                    Showing {pagination.from} to {pagination.to} of{" "}
                    {pagination.total} items
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      disabled={pagination.current_page === 1}
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      disabled={pagination.current_page === 1}
                      onClick={() => setPage(1)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      disabled={
                        pagination.current_page === pagination.last_page
                      }
                      onClick={() => setPage(pagination.last_page)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Last
                    </button>
                    <button
                      disabled={
                        pagination.current_page === pagination.last_page
                      }
                      onClick={() =>
                        setPage((prev) =>
                          Math.min(pagination.last_page, prev + 1),
                        )
                      }
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default Menu;

import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import api from "../../utils/api";

function MenuItems() {
  const [activeTab, setActiveTab] = useState("all");
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
    per_page: 15,
  });
  const [isFetching, setIsFetching] = useState(false);
  const { addToCart, loadingItems } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMenuItems(activeTab, page);
  }, [activeTab, page]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        "https://eatwella.tfnsolutions.us/api/categories",
        {
          headers: { Accept: "application/json" },
        },
      );
      setCategories(data.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchMenuItems = async (categoryId = "all", pageNumber = 1) => {
    setIsFetching(true);
    try {
      const baseUrl = "https://eatwella.tfnsolutions.us/api/menus";
      const params = new URLSearchParams();
      params.set("page", pageNumber);
      if (categoryId !== "all") {
        params.set("category_id", categoryId);
      }

      const url = `${baseUrl}?${params.toString()}`;
      const { data } = await axios.get(url, {
        headers: { Accept: "application/json" },
      });

      const pageData = data.data ?? [];
      setMenuItems(pageData);
      setPagination({
        current_page: data.current_page ?? pageNumber,
        last_page: data.last_page ?? 1,
        total: data.total ?? pageData.length,
        from: data.from ?? (pageData.length ? 1 : 0),
        to: data.to ?? pageData.length,
        per_page: data.per_page ?? pagination.per_page,
      });
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
    } finally {
      setIsFetching(false);
    }
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
    const result = await addToCart(item.id, 1);
    if (result) {
      showToast(`${item.name} added to cart!`, "success");
    } else {
      showToast("Failed to add to cart", "error");
    }
  };

  const handleAddExtra = async (item) => {
    const result = await addToCart(item.id, 1);
    if (result) {
      showToast(`${item.name} added to cart!`, "success");
    } else {
      showToast("Failed to add to cart", "error");
    }
    return result;
  };

  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-3 mb-12 flex-wrap">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-1 rounded-full font-medium transition-colors ${activeTab === "all" ? "bg-orange-500 text-white" : "bg-gray-200 text-black hover:bg-gray-300"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-6 py-1 rounded-full font-medium transition-colors ${activeTab === cat.id ? "bg-orange-500 text-white" : "bg-gray-200 text-black hover:bg-gray-300"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full"
            >
              <img
                src={item.images?.[0] || "https://via.placeholder.com/400x300"}
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
                  disabled={loadingItems[item.id]}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-bold transition-colors disabled:opacity-50 mt-auto"
                >
                  {loadingItems[item.id] ? "Adding..." : "Add To Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {pagination.last_page > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {isFetching ? (
              <div className="w-full text-center text-sm text-gray-500">
                Loading pages...
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuItems;

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { Link } from "react-router-dom";
import { checkWorkingHourAvailability } from "../../utils/checkWorkingHours";
import WorkingHoursClosedModal from "../Modals/WorkingHoursInfoModal";
import Marquee from "react-fast-marquee";
import api from "../../utils/api";

function Menu() {
  const [activeTab, setActiveTab] = useState("all");
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [closedModal, setClosedModal] = useState({
    open: false,
    message: "",
    schedule: [],
  });

  const { addToCart, loadingItems } = useCart();
  const { showToast } = useToast();

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [categoriesRes, menuRes] = await Promise.all([
        api.get("/categories"),
        api.get("/menus"),
      ]);
      setCategories(categoriesRes.data.data);
      setMenuItems(menuRes.data.data);
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const fetchMenuByCategory = useCallback(async (categoryId) => {
    setIsLoading(true);
    try {
      const url =
        categoryId === "all" ? "/menus" : `/menus?category_id=${categoryId}`;
      const { data } = await api.get(url);
      setMenuItems(data.data);
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (isInitialLoad) return;
    fetchMenuByCategory(activeTab);
  }, [activeTab]);

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
    <div className="bg-black text-white py-16 relative">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-bolota md:text-6xl font-black mb-8">
          MENU WEY SIZE YOUR
          <br />
          POCKET
        </h2>

        {/* Category tabs — hidden until fully loaded */}
        <div className="flex gap-3 mb-12 flex-wrap">
          {isLoading ? (
            // Skeleton pills while loading
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-gray-700 rounded-full animate-pulse"
              />
            ))
          ) : (
            <>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-1 rounded-full font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-6 py-1 rounded-full font-medium transition-colors ${
                    activeTab === cat.id
                      ? "bg-orange-500 text-white"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-white border-t-orange-500 rounded-full animate-spin" />
          <p className="text-white text-sm font-medium tracking-wide">
            Loading Menu...
          </p>
        </div>
      ) : menuItems.length > 3 ? (
        <div className="relative mb-8 overflow-hidden w-full">
          <Marquee speed={50} gradient={false} pauseOnHover>
            <div className="flex gap-6 h-[450px] mr-6">
              {[...menuItems, ...menuItems].map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="bg-white rounded-3xl overflow-hidden text-black w-[300px] min-w-[260px] md:min-w-[320px] flex flex-col h-full group"
                >
                  <div className="overflow-hidden">
                    <img
                      src={
                        item.images?.[0] ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={item.name}
                      className="w-full h-48 object-cover flex-shrink-0 transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                  </div>
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
                    <p className="text-gray-600 mb-4 line-clamp-2 overflow-hidden">
                      {item.description}
                    </p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={
                        item.stock_quantity < 1 || loadingItems[item.id]
                      }
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-auto"
                    >
                      {loadingItems[item.id] ? (
                        <span className="spinner" />
                      ) : null}
                      {loadingItems[item.id]
                        ? "Adding..."
                        : item.stock_quantity < 1
                          ? "Out of Stock"
                          : "Add To Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden text-black hover-zoom flex flex-col h-full"
              >
                <img
                  src={
                    item.images?.[0] || "https://via.placeholder.com/400x300"
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
                    disabled={item.stock_quantity < 1 || loadingItems[item.id]}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-auto"
                  >
                    {loadingItems[item.id] ? (
                      <span className="spinner" />
                    ) : null}
                    {loadingItems[item.id] ? "Adding..." : "Add To Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <Link to="/menu" className="block">
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition-colors">
              Satisfy Your Cravings →
            </button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 flex overflow-hidden opacity-50">
        {[...Array(20)].map((_, i) => (
          <img
            key={i}
            src="/src/assets/Frame 24.png"
            alt=""
            className="h-full w-auto flex-shrink-0"
          />
        ))}
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

export default Menu;

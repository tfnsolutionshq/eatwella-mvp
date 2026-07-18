import { useState, useEffect, useCallback } from "react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { Link } from "react-router-dom";
import { checkWorkingHourAvailability } from "../../utils/checkWorkingHours";
import WorkingHoursClosedModal from "../Modals/WorkingHoursInfoModal";
import Marquee from "react-fast-marquee";
import api from "../../utils/api";
import { useGeolocation } from "../../hooks/useGeolocation";

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
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [isLoadingOutlets, setIsLoadingOutlets] = useState(false);
  const [outletsError, setOutletsError] = useState(null);
  const [menuError, setMenuError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);

  const { addToCart, loadingItems, clearCart } = useCart();
  const { showToast } = useToast();
  const { getLocation } = useGeolocation();

  const fetchOutlets = async () => {
    setIsLoadingOutlets(true);
    setOutletsError(null);
    try {
      const { data } = await api.get("/outlets");
      setOutlets(data);
      if (data.length > 0) {
        getLocation(async ({ latitude, longitude }) => {
          try {
            const { data: nearestData } = await api.post("/outlets/nearest", {
              latitude,
              longitude,
            });
            if (nearestData?.outlet?.id) {
              setSelectedOutlet(nearestData.outlet.id);
              return;
            }
          } catch (err) {
            console.error("Failed to fetch nearest outlet:", err);
          }
          setSelectedOutlet(data[0].id);
        });
        setSelectedOutlet(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch outlets:", err);
      setOutletsError(err.message || "Failed to load outlets");
    } finally {
      setIsLoadingOutlets(false);
    }
  };

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

  const fetchMenu = useCallback(
    async (categoryId = "all") => {
      setIsLoading(true);
      setMenuError(null);
      try {
        const params = new URLSearchParams();
        if (categoryId !== "all") {
          params.append("category_id", categoryId);
        }
        if (selectedOutlet) {
          params.append("outlet_id", selectedOutlet);
        }
        const url = params.toString()
          ? `/menus?${params.toString()}`
          : "/menus";
        const { data } = await api.get(url);
        setMenuItems(data.data);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
        setMenuError(err.message || "Failed to load menu");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedOutlet],
  );

  const fetchInitialData = async () => {
    // Fetch categories separately to handle errors individually
    fetchCategories();
  };

  const fetchMenuByCategory = useCallback(
    async (categoryId) => {
      fetchMenu(categoryId);
    },
    [fetchMenu],
  );

  useEffect(() => {
    fetchInitialData();
    fetchOutlets();
  }, []);

  useEffect(() => {
    // Wait until selectedOutlet is set (after outlets have loaded) before fetching menu
    if (!selectedOutlet) return;
    fetchMenu(activeTab);
    // Once we've fetched the menu for the first time, set isInitialLoad to false
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [activeTab, selectedOutlet, fetchMenu, isInitialLoad]);

  const handleAddToCart = async (item) => {
    const { available, message, schedule } =
      await checkWorkingHourAvailability();

    if (!available) {
      setClosedModal({ open: true, message, schedule });
      return;
    }

    const result = await addToCart(item.id, 1, selectedOutlet);
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

        {/* Outlet Selector */}
        <div className="mb-8">
          {isLoadingOutlets ? (
            <div className="flex items-center gap-2">
              <div className="h-10 w-48 bg-gray-700 rounded-lg animate-pulse" />
            </div>
          ) : outletsError ? (
            <div className="flex flex-col gap-2">
              <p className="text-red-400 text-sm">{outletsError}</p>
              <button
                onClick={fetchOutlets}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors w-fit"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <span className="mr-2">Select An Outlet:</span>
              <select
                value={selectedOutlet || ""}
                onChange={(e) => {
                  const newOutlet = e.target.value;
                  if (newOutlet !== selectedOutlet) {
                    clearCart();
                  }
                  setSelectedOutlet(newOutlet);
                }}
                className="bg-white text-black px-4 py-2 rounded-lg font-medium w-full md:w-64"
              >
                {outlets.map((outlet) => (
                  <option key={outlet.id} value={outlet.id}>
                    {outlet.name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

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
          ) : categoriesError ? (
            <div className="flex flex-col gap-2">
              <p className="text-red-400 text-sm">{categoriesError}</p>
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
      ) : menuError ? (
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-red-400 text-sm">{menuError}</p>
            <button
              onClick={() => fetchMenu(activeTab)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
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

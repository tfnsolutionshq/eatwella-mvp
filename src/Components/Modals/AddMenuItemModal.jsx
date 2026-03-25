import { useState, useRef, useEffect } from "react";
import { FiX, FiSearch, FiChevronDown } from "react-icons/fi";
import api from "../../utils/api";

const AddMenuItemModal = ({
  isOpen,
  onClose,
  categories,
  onSuccess,
  menuItems,
}) => {
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    is_available: 1,
    takeawayPack: 1,
    sideDishes: [],
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Live search state
  const [sideDishSearch, setSideDishSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter menu items based on search query
  const filteredItems = (menuItems || []).filter((item) =>
    item.name.toLowerCase().includes(sideDishSearch.toLowerCase()),
  );

  // Get full objects for selected side dishes
  const selectedSideDishes = (menuItems || []).filter((item) =>
    formData.sideDishes.includes(item.id),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !searchRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSideDish = (id) => {
    setFormData((prev) => ({
      ...prev,
      sideDishes: prev.sideDishes.includes(id)
        ? prev.sideDishes.filter((s) => s !== id)
        : [...prev.sideDishes, id],
    }));
  };

  const removeSideDish = (id) => {
    setFormData((prev) => ({
      ...prev,
      sideDishes: prev.sideDishes.filter((s) => s !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("over here guys: ", formData);

    try {
      const data = new FormData();
      data.append("category_id", formData.category_id);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("is_available", formData.is_available);
      data.append("requires_takeaway", formData.takeawayPack);
      formData.sideDishes.forEach((id) => data.append("complements[]", id));
      images.forEach((img) => data.append("images[]", img));

      await api.post("/admin/menus", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData({
        category_id: "",
        name: "",
        description: "",
        price: "",
        is_available: 1,
        takeawayPack: 1,
        sideDishes: [],
      });
      setImages([]);
      setSideDishSearch("");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.log("The error here: ", err);
      setError(err.response?.data?.message || "Failed to create menu item");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 my-8 h-[600px] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-100 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Add New Menu Item
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Add a new item to your menu
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Grilled Salmon"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your dish..."
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0.00"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => {
                    console.log("This value for e: ", e.target.value);
                    setFormData({ ...formData, category_id: e.target.value });
                  }}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all bg-white"
                >
                  <option value="">Select category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Complementary Dishes - Live Search */}
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Complementary (Side) Dishes
              </p>

              {/* Selected dishes as tags */}
              {selectedSideDishes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedSideDishes.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200"
                    >
                      {item.name}
                      <button
                        type="button"
                        onClick={() => removeSideDish(item.id)}
                        className="hover:text-orange-900 transition-colors ml-0.5"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search input */}
              <div className="relative">
                <div
                  ref={searchRef}
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-500 transition-all bg-white"
                >
                  <FiSearch className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={sideDishSearch}
                    onChange={(e) => {
                      setSideDishSearch(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search for a dish..."
                    className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                  <FiChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Dropdown results */}
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
                  >
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => {
                        const isSelected = formData.sideDishes.includes(
                          item.id,
                        );
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              toggleSideDish(item.id);
                              setSideDishSearch("");
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                              isSelected
                                ? "bg-orange-50 text-orange-700 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span>{item.name}</span>
                            {isSelected && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                                Added
                              </span>
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <p className="px-4 py-3 text-sm text-gray-400 text-center">
                        No dishes match "{sideDishSearch}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {selectedSideDishes.length > 0 && (
                <p className="text-xs text-gray-400 mt-1.5">
                  {selectedSideDishes.length} dish
                  {selectedSideDishes.length > 1 ? "es" : ""} selected
                </p>
              )}
            </div>

            {/* Takeaway Pack */}
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Include Take Away Pack (For Deliveries and Pickups)?
                <span className="text-red-500">*</span>
              </p>
              <div className="flex flex-col">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="takeawayPack"
                    checked={formData.takeawayPack === 1}
                    onChange={() =>
                      setFormData({ ...formData, takeawayPack: 1 })
                    }
                    className="mr-1"
                    required
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="takeawayPack"
                    checked={formData.takeawayPack === 0}
                    onChange={() =>
                      setFormData({ ...formData, takeawayPack: 0 })
                    }
                    className="mr-1"
                    required
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200 transition-all disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemModal;

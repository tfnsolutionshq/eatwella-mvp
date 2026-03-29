import { useState, useEffect, useRef } from "react";
import { FiX, FiSearch, FiChevronDown } from "react-icons/fi";
import api from "../../utils/api";

// ─────────────────────────────────────────────────────────────────────────────
// DEV TESTING TOGGLE
// Set this to `true` to simulate a menu item that already has side dishes.
// Flip back to `false` before going to production.
// ─────────────────────────────────────────────────────────────────────────────
const SIMULATE_EXISTING_SIDES = false;

const MOCK_SIDES = [
  { id: 9901, name: "Coleslaw" },
  { id: 9902, name: "Garlic Bread" },
];
// ─────────────────────────────────────────────────────────────────────────────

const EditMenuItemModal = ({
  isOpen,
  onClose,
  item,
  categories,
  onSuccess,
  menuItems = [],
}) => {
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    is_available: 1,
    takeawayPack: 0,
    sideDishes: [],
  });
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Live search state
  const [sideDishSearch, setSideDishSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (item) {
      console.log("The item here: ", item.complements);

      // Resolve existing side dish IDs from the item, or inject mock data for testing
      const existingSideIds = SIMULATE_EXISTING_SIDES
        ? MOCK_SIDES.map((s) => s.id)
        : (item.complements ?? []).map((s) =>
            typeof s === "object" ? s.id : s,
          );

      console.log("just checking: ", existingSideIds);

      setFormData({
        category_id: item.category_id || "",
        name: item.name || "",
        description: item.description || "",
        price: item.price || "",
        is_available: item.is_available ?? 1,
        takeawayPack: (item.requires_takeaway === true ? 1 : 0) ?? 0,
        sideDishes: existingSideIds,
      });
      setCurrentImage(item.images?.[0] || "");
      setImages([]);
      setSideDishSearch("");
    }
  }, [item]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Merge real menu items with mock sides so selected tags resolve correctly during testing
  const allKnownItems = SIMULATE_EXISTING_SIDES
    ? [
        ...menuItems,
        ...MOCK_SIDES.filter((m) => !menuItems.find((i) => i.id === m.id)),
      ]
    : menuItems;

  const filteredItems = allKnownItems.filter(
    (i) =>
      i.is_available !== 0 &&
      i.id !== item?.id &&
      i.name.toLowerCase().includes(sideDishSearch.toLowerCase()),
  );

  const selectedSideDishes = allKnownItems.filter((i) =>
    formData.sideDishes.includes(i.id),
  );

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

    console.log("form data: ", formData);

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

      await api.put(`/admin/menus/${item.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update menu item");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-start justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Edit Menu Item
              </h2>
              <p className="text-sm text-gray-500 mt-1">Update item details</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Dev testing banner */}
            {SIMULATE_EXISTING_SIDES && (
              <div className="bg-amber-50 border border-amber-300 text-amber-700 px-4 py-2 rounded-lg text-xs font-medium">
                🛠 Dev mode: simulating pre-existing side dishes. Set{" "}
                <code className="font-mono">
                  SIMULATE_EXISTING_SIDES = false
                </code>{" "}
                before shipping.
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
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
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
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all resize-none"
              />
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
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
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
              {currentImage && (
                <img
                  src={currentImage}
                  alt="Current"
                  className="mb-2 w-full h-32 object-cover rounded-lg"
                />
              )}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
              />
            </div>

            {/* ── Complementary Dishes ── */}
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Complementary (Side) Dishes
              </p>

              {/* Current sides display */}
              {selectedSideDishes.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedSideDishes.map((dish) => (
                    <span
                      key={dish.id}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200"
                    >
                      {dish.name}
                      <button
                        type="button"
                        onClick={() => removeSideDish(dish.id)}
                        className="hover:text-orange-900 transition-colors ml-0.5"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic mb-3">
                  No complementary dishes added yet.
                </p>
              )}

              {/* Live search input */}
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
                    placeholder="Search to add a dish..."
                    className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                  <FiChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
                  >
                    {filteredItems.length > 0 ? (
                      filteredItems.map((dish) => {
                        const isSelected = formData.sideDishes.includes(
                          dish.id,
                        );
                        return (
                          <button
                            key={dish.id}
                            type="button"
                            onClick={() => {
                              toggleSideDish(dish.id);
                              setSideDishSearch("");
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                              isSelected
                                ? "bg-orange-50 text-orange-700 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span>{dish.name}</span>
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

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 flex-shrink-0">
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItemModal;

import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import AddStaffModal from "../../Components/Modals/AddStaffModal";
import {
  FiEye,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUserPlus,
  FiX,
} from "react-icons/fi";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

// Maps tab key → API role value
const ROLE_MAP = {
  customers: "customer",
  supervisors: "supervisor",
  "delivery agents": "delivery_agent",
  attendants: "attendant",
  kitchen: "kitchen",
  "store keepers": "store_keeper",
};

const AllUsers = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
    per_page: 15,
  });
  const [searchInput, setSearchInput] = useState("");

  // Debounced search effect
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1); // Reset to first page when searching
    }, 300); // 300ms delay

    return () => clearTimeout(timerId);
  }, [searchInput]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Build params
      const params = { page, per_page: pagination.per_page };
      let response;

      if (searchQuery.trim()) {
        // When searching, fetch a larger dataset to filter client-side
        setIsSearching(true);
        const searchParams = { ...params, per_page: 100 }; // Fetch more records for search
        response = await api.get("/admin/users", { params: searchParams });

        // Apply client-side filtering for multi-field search
        const rawData = response?.data;
        const allData = rawData?.data ?? rawData;
        const allUsersData = Array.isArray(allData) ? allData : [];

        const searchLower = searchQuery.toLowerCase().trim();
        const filteredUsers = allUsersData.filter((user) => {
          // Search by name
          if (user.name?.toLowerCase().includes(searchLower)) {
            return true;
          }
          // Search by email
          if (user.email?.toLowerCase().includes(searchLower)) {
            return true;
          }
          // Search by phone
          if (user.phone?.toLowerCase().includes(searchLower)) {
            return true;
          }
          return false;
        });

        // Apply pagination to filtered results
        const total = filteredUsers.length;
        const perPage = pagination.per_page;
        const lastPage = Math.max(1, Math.ceil(total / perPage));
        const currentPage = Math.min(page, lastPage);
        const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
        const to = Math.min(currentPage * perPage, total);
        const pageUsers = filteredUsers.slice(from - 1, to);

        setAllUsers(filteredUsers);
        setUsers(pageUsers);
        setPagination({
          current_page: currentPage,
          last_page: lastPage,
          total,
          from,
          to,
          per_page: pagination.per_page,
        });
        if (currentPage !== page) setPage(currentPage);
        return;
      } else {
        // Use regular endpoint when no search query
        response = await api.get("/admin/users", { params });
      }

      const rawData = response?.data;
      const pageUsers = Array.isArray(rawData?.data) ? rawData.data : [];

      setUsers(pageUsers);
      setPagination({
        current_page: rawData?.current_page ?? page,
        last_page: rawData?.last_page ?? 1,
        total: rawData?.total ?? pageUsers.length,
        from: rawData?.from ?? (pageUsers.length ? 1 : 0),
        to: rawData?.to ?? pageUsers.length,
        per_page: rawData?.per_page ?? pagination.per_page,
      });
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers();
    return () => controller.abort();
  }, [page, searchQuery]);

  const filteredUsers = useMemo(() => {
    const baseUsers = searchQuery.trim() ? allUsers : users;
    return activeTab === "all"
      ? baseUsers
      : baseUsers.filter((u) => u.role === ROLE_MAP[activeTab]);
  }, [activeTab, users, allUsers, searchQuery]);

  const getVisiblePageNumbers = () => {
    const totalPages = pagination.last_page;
    const current = pagination.current_page;

    if (totalPages <= 7) {
      if (totalPages <= 1) return [];
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, current - 2);
    let end = Math.min(totalPages, current + 2);

    if (current <= 3) {
      end = Math.min(7, totalPages);
    } else if (current >= totalPages - 2) {
      start = totalPages - 6;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-purple-100 text-purple-600",
      supervisor: "bg-orange-100 text-orange-600",
      delivery_agent: "bg-green-100 text-green-600",
      attendant: "bg-yellow-100 text-yellow-600",
      kitchen: "bg-red-100 text-red-600",
      customer: "bg-blue-100 text-blue-600",
      store_keeper: "bg-teal-100 text-teal-600",
    };
    return styles[role] ?? "bg-gray-100 text-gray-600";
  };

  const formatRoleLabel = (role) => {
    return role === "delivery_agent"
      ? "Delivery Agent"
      : role === "store_keeper"
        ? "Store Keeper"
        : role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <>
      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        onSuccess={fetchUsers}
      />
      <DashboardLayout>
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View and manage all users
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone number or email..."
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                  className="pl-10 pr-10 py-2 w-full sm:w-80 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors shadow-sm"
                />
                {searchInput && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsAddStaffOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
              >
                <FiUserPlus className="w-4 h-4" />
                Add New Staff
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {[
                "all",
                "customers",
                "supervisors",
                "delivery agents",
                "attendants",
                "kitchen",
                "store keepers",
              ].map((tab) => {
                const count =
                  tab === "all"
                    ? users.length
                    : users.filter((u) => u.role === ROLE_MAP[tab]).length;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-gray-200 text-gray-900 shadow-sm font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab === "all"
                      ? "All Users"
                      : tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
                    {loading ? (
                      <span className="inline-block w-5 h-3.5 bg-gray-200 rounded animate-pulse align-middle" />
                    ) : (
                      <span>({count})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Results Indicator */}
          {searchQuery.trim() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-blue-700">
                Search results for "{searchQuery}"
                {!isSearching && (
                  <span className="font-medium ml-1">
                    ({pagination.total}{" "}
                    {pagination.total === 1 ? "user" : "users"} found)
                  </span>
                )}
              </span>
              <button
                onClick={handleClearSearch}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm font-medium tracking-wide">
                Loading Users...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="p-5 border-b border-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {user.name}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}
                        >
                          {formatRoleLabel(user.role)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiMail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{user.email}</span>
                    </div>

                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}

                    {user.state && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        <span>{user.state}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiCalendar className="w-4 h-4 text-gray-400" />
                      <span>
                        Joined{" "}
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {user.addresses && user.addresses.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          {user.addresses.length} saved address
                          {user.addresses.length > 1 ? "es" : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      <FiEye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t border-gray-200 pt-6">
              <div className="text-sm text-gray-500">
                Showing {pagination.from} to {pagination.to} of{" "}
                {pagination.total} users
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={pagination.current_page === 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.current_page === 1}
                  onClick={() => setPage(1)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => setPage(pagination.last_page)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Last
                </button>
                <button
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() =>
                    setPage((prev) => Math.min(pagination.last_page, prev + 1))
                  }
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default AllUsers;

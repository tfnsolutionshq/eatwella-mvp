import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import {
  FiFilter,
  FiEye,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiX,
  FiCheck,
  FiMap,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
} from "react-icons/fi";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useToast } from "../../context/ToastContext";

const RiderManagement = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("all_riders");
  const [riders, setRiders] = useState([]);
  const [allRiders, setAllRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [savingAssignment, setSavingAssignment] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
    per_page: 15,
  });
  // Application related state
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsPage, setApplicationsPage] = useState(1);
  const [applicationsPagination, setApplicationsPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
    per_page: 15,
  });
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);

  // Load cities for assignment modal
  const loadCities = async () => {
    try {
      setCitiesLoading(true);
      const { data } = await api.get("/cities");
      const list = Array.isArray(data) ? data : (data.data ?? []);
      setCities(list.filter((city) => city.is_active !== false));
    } catch (err) {
      console.error("Failed to load cities:", err);
    } finally {
      setCitiesLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchInput]);

  // Fetch rider applications
  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);
      const response = await api.get("/admin/rider-applications", {
        params: { page: applicationsPage },
      });
      const rawData = response?.data;
      const list = Array.isArray(rawData?.data) ? rawData.data : [];

      setApplications(list);
      setApplicationsPagination({
        current_page: rawData?.current_page ?? applicationsPage,
        last_page: rawData?.last_page ?? 1,
        total: rawData?.total ?? list.length,
        from: rawData?.from ?? (list.length ? 1 : 0),
        to: rawData?.to ?? list.length,
        per_page: rawData?.per_page ?? 15,
      });
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setApplicationsLoading(false);
    }
  };

  // Approve application
  const handleApproveApplication = async (application) => {
    try {
      setProcessingAction(true);
      await api.post(`/admin/rider-applications/${application.id}/approve`);
      showToast("Application approved successfully", "success");
      fetchApplications();
      fetchRiders();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to approve application",
        "error",
      );
    } finally {
      setProcessingAction(false);
    }
  };

  // Reject application
  const handleRejectApplication = async (application) => {
    try {
      setProcessingAction(true);
      await api.post(`/admin/rider-applications/${application.id}/reject`);
      showToast("Application rejected successfully", "success");
      fetchApplications();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to reject application",
        "error",
      );
    } finally {
      setProcessingAction(false);
    }
  };

  useEffect(() => {
    if (activeTab === "all_riders") {
      fetchRiders();
    } else if (activeTab === "applications") {
      fetchApplications();
    }
  }, [page, searchQuery, activeTab, applicationsPage]);

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  const fetchRiders = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        per_page: pagination.per_page,
        role: "delivery_agent",
      };

      if (searchQuery.trim()) {
        setIsSearching(true);
        const searchParams = { ...params, per_page: 100, search: searchQuery };
        const response = await api.get("/admin/users", {
          params: searchParams,
        });
        const rawData = response?.data;
        const allData = rawData?.data ?? rawData;
        const list = Array.isArray(allData) ? allData : [];

        setAllRiders(list);
        setRiders(list.slice(0, pagination.per_page));
        setPagination({
          current_page: 1,
          last_page: Math.max(1, Math.ceil(list.length / pagination.per_page)),
          total: list.length,
          from: list.length > 0 ? 1 : 0,
          to: Math.min(pagination.per_page, list.length),
          per_page: pagination.per_page,
        });
      } else {
        const response = await api.get("/admin/users", { params });
        const rawData = response?.data;
        const list = Array.isArray(rawData?.data) ? rawData.data : [];

        console.log("Fetched all riders for search:", response);

        setRiders(list);
        setAllRiders(list);
        setPagination({
          current_page: rawData?.current_page ?? page,
          last_page: rawData?.last_page ?? 1,
          total: rawData?.total ?? list.length,
          from: rawData?.from ?? (list.length ? 1 : 0),
          to: rawData?.to ?? list.length,
          per_page: rawData?.per_page ?? pagination.per_page,
        });
      }
    } catch (err) {
      console.error("Failed to fetch riders:", err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const openAssignModal = (rider) => {
    setSelectedRider(rider);
    setSelectedCities(rider.cities?.map((c) => c.id) || []);
    loadCities();
    setAssignModal(true);
  };

  const handleAssignCities = async () => {
    try {
      setSavingAssignment(true);
      await api.post(`/admin/users/${selectedRider.id}/cities`, {
        city_ids: selectedCities,
      });
      showToast("Cities assigned successfully", "success");
      setAssignModal(false);
      fetchRiders();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to assign cities",
        "error",
      );
    } finally {
      setSavingAssignment(false);
    }
  };

  const visibleRiders = useMemo(() => {
    if (searchQuery.trim()) {
      const start = (page - 1) * pagination.per_page;
      const end = start + pagination.per_page;
      return allRiders.slice(start, end);
    }
    return riders;
  }, [riders, allRiders, searchQuery, page, pagination.per_page]);

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

  const getVisibleApplicationPageNumbers = () => {
    const totalPages = applicationsPagination.last_page;
    const current = applicationsPagination.current_page;

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

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "approved":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const tabs = [
    { key: "all_riders", label: "All Riders" },
    { key: "applications", label: "Applications" },
  ];

  return (
    <>
      {/* Assign Cities Modal */}
      {assignModal && selectedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setAssignModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FiMap className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Assign Cities
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedRider.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAssignModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {citiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {cities.map((city) => (
                    <label
                      key={city.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCities.includes(city.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCities([...selectedCities, city.id]);
                          } else {
                            setSelectedCities(
                              selectedCities.filter((id) => id !== city.id),
                            );
                          }
                        }}
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {city.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setAssignModal(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignCities}
                disabled={savingAssignment}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-orange-200"
              >
                {savingAssignment ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {detailsModal && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDetailsModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FiFileText className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Application Details
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedApplication.application_id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailsModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    First Name
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedApplication.first_name}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Last Name
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedApplication.last_name}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Email
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {selectedApplication.email}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Phone
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {selectedApplication.phone}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  State
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {selectedApplication.state}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Vehicle Type
                </label>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {selectedApplication.vehicle_type}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </label>
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadgeStyle(
                    selectedApplication.status,
                  )}`}
                >
                  {selectedApplication.status.charAt(0).toUpperCase() +
                    selectedApplication.status.slice(1)}
                </span>
              </div>
              {selectedApplication.admin_note && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Admin Note
                  </label>
                  <p className="text-sm text-gray-700 mt-1">
                    {selectedApplication.admin_note}
                  </p>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Applied At
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(selectedApplication.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setDetailsModal(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <DashboardLayout>
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Rider Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage delivery agents and their assignments
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone number or email…"
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
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <FiFilter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {tabs.map((tab) => {
                const count =
                  tab.key === "all_riders"
                    ? pagination.total
                    : tab.key === "applications"
                      ? applicationsPagination.total
                      : 0;
                const isLoading =
                  (tab.key === "all_riders" && loading) ||
                  (tab.key === "applications" && applicationsLoading);
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      if (tab.key === "all_riders") setPage(1);
                      if (tab.key === "applications") setApplicationsPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? "bg-gray-200 text-gray-900 shadow-sm font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                    {isLoading && activeTab === tab.key && (
                      <span className="inline-block w-5 h-3.5 bg-gray-200 rounded animate-pulse align-middle ml-2" />
                    )}
                    {!isLoading && activeTab === tab.key && (
                      <span className="ml-2">({count})</span>
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
                    ({pagination.total} rider{pagination.total !== 1 ? "s" : ""}{" "}
                    found)
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

          {/* Applications Tab Content */}
          {activeTab === "applications" && (
            <>
              {applicationsLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                  <p className="text-gray-500 text-sm font-medium tracking-wide">
                    Loading applications…
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {applications.map((application) => (
                      <div
                        key={application.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                      >
                        <div className="p-5 border-b border-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 text-lg mb-1">
                                {application.first_name} {application.last_name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                                  {application.application_id}
                                </span>
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                                    application.status,
                                  )}`}
                                >
                                  {application.status.charAt(0).toUpperCase() +
                                    application.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 flex-1 space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiMail className="w-4 h-4 text-gray-400" />
                            <span className="truncate">
                              {application.email}
                            </span>
                          </div>

                          {application.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FiPhone className="w-4 h-4 text-gray-400" />
                              <span>{application.phone}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiMapPin className="w-4 h-4 text-gray-400" />
                            <span>{application.vehicle_type}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiCalendar className="w-4 h-4 text-gray-400" />
                            <span>
                              Applied{" "}
                              {new Date(
                                application.created_at,
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setDetailsModal(true);
                            }}
                            className="flex-1 min-w-[80px] flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                          >
                            <FiEye className="w-4 h-4" />
                            Details
                          </button>
                          {application.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleApproveApplication(application)
                                }
                                disabled={processingAction}
                                className="flex-1 min-w-[80px] flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-green-200"
                              >
                                <FiCheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleRejectApplication(application)
                                }
                                disabled={processingAction}
                                className="flex-1 min-w-[80px] flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-red-200"
                              >
                                <FiXCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Applications Pagination */}
                  {!applicationsLoading &&
                    applicationsPagination.last_page > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t border-gray-200 pt-6">
                        <div className="text-sm text-gray-500">
                          Showing {applicationsPagination.from} to{" "}
                          {applicationsPagination.to} of{" "}
                          {applicationsPagination.total} applications
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            disabled={applicationsPagination.current_page === 1}
                            onClick={() =>
                              setApplicationsPage((prev) =>
                                Math.max(1, prev - 1),
                              )
                            }
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Previous
                          </button>
                          <button
                            disabled={applicationsPagination.current_page === 1}
                            onClick={() => setApplicationsPage(1)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            First
                          </button>
                          {getVisibleApplicationPageNumbers().map(
                            (pageNumber) => (
                              <button
                                key={pageNumber}
                                onClick={() => setApplicationsPage(pageNumber)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 transition-colors ${
                                  applicationsPagination.current_page ===
                                  pageNumber
                                    ? "bg-orange-500 text-white border-orange-500"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            ),
                          )}
                          <button
                            disabled={
                              applicationsPagination.current_page ===
                              applicationsPagination.last_page
                            }
                            onClick={() =>
                              setApplicationsPage(
                                applicationsPagination.last_page,
                              )
                            }
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Last
                          </button>
                          <button
                            disabled={
                              applicationsPagination.current_page ===
                              applicationsPagination.last_page
                            }
                            onClick={() =>
                              setApplicationsPage((prev) =>
                                Math.min(
                                  applicationsPagination.last_page,
                                  prev + 1,
                                ),
                              )
                            }
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                </>
              )}
            </>
          )}

          {/* All Riders Tab Content */}
          {activeTab === "all_riders" && (
            <>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                  <p className="text-gray-500 text-sm font-medium tracking-wide">
                    Loading Riders…
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {visibleRiders.map((rider) => (
                    <div
                      key={rider.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                    >
                      <div className="p-5 border-b border-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">
                              {rider.name}
                            </h3>
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                              Delivery Agent
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 flex-1 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiMail className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{rider.email}</span>
                        </div>

                        {rider.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiPhone className="w-4 h-4 text-gray-400" />
                            <span>{rider.phone}</span>
                          </div>
                        )}

                        {rider.cities && rider.cities.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiMapPin className="w-4 h-4 text-gray-400" />
                            <span>
                              {rider.cities.map((c) => c.name).join(", ")}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FiCalendar className="w-4 h-4 text-gray-400" />
                          <span>
                            Joined{" "}
                            {new Date(rider.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/users/${rider.id}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                        >
                          <FiEye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => openAssignModal(rider)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
                        >
                          <FiMapPin className="w-4 h-4" />
                          Assign Cities
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && pagination.last_page > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t border-gray-200 pt-6">
                  <div className="text-sm text-gray-500">
                    Showing {pagination.from} to {pagination.to} of{" "}
                    {pagination.total} riders
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
                      disabled={
                        pagination.current_page === pagination.last_page
                      }
                      onClick={() => setPage(pagination.last_page)}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default RiderManagement;

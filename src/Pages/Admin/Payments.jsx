import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../DashboardLayout/DashboardLayout";
import {
  FiDollarSign,
  FiCreditCard,
  FiLayout,
  FiSearch,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";
import api from "../../utils/api";

function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [totals, setTotals] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // All-payments dataset for client-side search
  const [allPayments, setAllPayments] = useState([]);
  const [allPaymentsLoading, setAllPaymentsLoading] = useState(false);
  const [filteredPayments, setFilteredPayments] = useState([]);

  // Pagination state (mirrors Menu.jsx)
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
    per_page: 15,
  });

  // Initial load — fetch first page + full dataset for search
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/admin/payments?page=1");
        const fetchedTotals = data.totals;
        setTotals(fetchedTotals);
        const paymentsData = data.payments.data ?? [];
        setPayments(paymentsData);
        setPagination({
          current_page: data.payments.current_page ?? 1,
          last_page: data.payments.last_page ?? 1,
          total: data.payments.total ?? paymentsData.length,
          from: data.payments.from ?? (paymentsData.length ? 1 : 0),
          to: data.payments.to ?? paymentsData.length,
          per_page: data.payments.per_page ?? 15,
        });

        // Fetch full dataset for client-side search
        if (fetchedTotals?.total_transactions) {
          setAllPaymentsLoading(true);
          try {
            const { data: allData } = await api.get(
              `/admin/payments?per_page=${fetchedTotals.total_transactions}`
            );
            setAllPayments(allData.payments.data ?? []);
          } catch (err) {
            console.error("Failed to fetch all payments for search:", err);
          } finally {
            setAllPaymentsLoading(false);
          }
        }
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Fetch payments for specific page
  const fetchPayments = useCallback(
    async (pageNumber = 1) => {
      setLoading(true);
      try {
        const { data } = await api.get(`/admin/payments?page=${pageNumber}`);
        const paymentsData = data.payments.data ?? [];
        setPayments(paymentsData);
        setPagination({
          current_page: data.payments.current_page ?? pageNumber,
          last_page: data.payments.last_page ?? 1,
          total: data.payments.total ?? paymentsData.length,
          from: data.payments.from ?? (paymentsData.length ? 1 : 0),
          to: data.payments.to ?? paymentsData.length,
          per_page: data.payments.per_page ?? 15,
        });
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Update payments when page changes
  useEffect(() => {
    fetchPayments(page);
  }, [page, fetchPayments]);

  // Live search — filter allPayments by invoice_number or order_number
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPayments([]);
      return;
    }
    const term = searchTerm.trim().toLowerCase();
    const results = allPayments.filter((p) => {
      const invoice = (p.invoice_number ?? "").toLowerCase();
      const orderNum = (p.order?.order_number ?? "").toLowerCase();
      return invoice.includes(term) || orderNum.includes(term);
    });
    setFilteredPayments(results);
  }, [searchTerm, allPayments]);

  // Pagination helpers (mirrors Menu.jsx)
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

  const stats = totals ? [
    {
      label: "Total Revenue",
      value: new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
      }).format(Math.ceil(totals.total_revenue)),
      icon: FiDollarSign,
      color: "bg-green-500",
    },
    {
      label: "Pending",
      value: totals.total_pending,
      icon: FiClock,
      color: "bg-orange-500",
    },
    {
      label: "Completed",
      value: totals.total_completed,
      icon: FiCreditCard,
      color: "bg-blue-500",
    },
    {
      label: "Transactions",
      value: totals.total_transactions,
      icon: FiLayout,
      color: "bg-purple-500",
    },
  ] : [];

  const statColors = [
    "bg-green-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "unpaid":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "—";

  const getMethodColor = (method) => {
    switch (method) {
      case "paystack":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "cash":
        return "bg-green-50 text-green-600 border-green-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Page heading — always visible */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500">
            Track all transactions and payment methods
          </p>
        </div>

        {/* Stat cards — skeletons while loading, real values after */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? statColors.map((color, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                  {/* Icon placeholder */}
                  <div
                    className={`w-12 h-12 rounded-xl ${color} opacity-20 mb-4 animate-pulse`}
                  />
                  {/* Value placeholder */}
                  <div className="h-7 w-32 bg-gray-200 rounded-lg animate-pulse mb-2" />
                  {/* Label placeholder */}
                  <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                </div>
              ))
            : stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${stat.color} text-white shadow-sm`}
                    >
                      <stat.icon size={24} />
                    </div>
                    {stat.trend && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <FiTrendingUp size={12} />
                        {stat.trend}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
        </div>

        {/* Search bar */}
        <div className="relative">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by invoice number or order number..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {allPaymentsLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Payments table — spinner while loading, table after */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm font-medium tracking-wide">
              Loading Payments...
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Search result count */}
            {searchTerm.trim() && (
              <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 text-sm text-gray-500">
                {filteredPayments.length === 0
                  ? "No results found"
                  : `${filteredPayments.length} result${filteredPayments.length !== 1 ? "s" : ""} for "${searchTerm}"`}
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    {[
                      "Invoice",
                      "Order",
                      "Customer",
                      "Amount",
                      "Method",
                      "Status",
                      "Date",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(() => {
                    const displayPayments = searchTerm.trim()
                      ? filteredPayments
                      : payments;
                    if (displayPayments.length === 0) {
                      return (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-16 text-center text-sm text-gray-400"
                          >
                            {searchTerm.trim()
                              ? "No payments match your search."
                              : "No payments found."}
                          </td>
                        </tr>
                      );
                    }
                    return displayPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                          {payment.invoice_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {payment.order?.order_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                          {payment.order?.customer_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                            minimumFractionDigits: 0,
                          }).format(Math.ceil(payment.amount))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getMethodColor(payment.payment_method)}`}
                          >
                            {capitalize(payment.payment_method)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.payment_status)}`}
                          >
                            {capitalize(payment.payment_status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(payment.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination controls — hidden during search (mirrors Menu.jsx) */}
        {!loading && !searchTerm.trim() && pagination.last_page > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-500">
              Showing {pagination.from} to {pagination.to} of{" "}
              {pagination.total} payments
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
      </div>
    </DashboardLayout>
  );
}

export default Payments;

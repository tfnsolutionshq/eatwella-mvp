import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiTrendingUp,
  FiStar,
  FiAward,
  FiChevronRight,
  FiShoppingBag,
  FiGift,
} from "react-icons/fi";
import { OrderCard, OrderDetailsModal } from "../../Components/UserDashboard/shared";
import { ngn } from "../../Components/UserDashboard/shared/utils";
import api from "../../utils/api";

function OverviewPage() {
  const [overview, setOverview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [overviewRes, ordersRes] = await Promise.all([
          api.get("/customer/overview"),
          api.get("/customer/orders"),
        ]);
        setOverview(overviewRes.data);
        setOrders(ordersRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch overview data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium tracking-wide">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          {
            icon: FiPackage,
            bg: "bg-orange-50 text-orange-600",
            value: overview?.total_orders || 0,
            label: "Total Orders",
          },
          {
            icon: FiTrendingUp,
            bg: "bg-emerald-50 text-emerald-600",
            value: ngn(overview?.total_spent || 0),
            label: "Total Spent",
          },
          {
            icon: FiStar,
            bg: "bg-gray-50 text-gray-600",
            value: overview?.loyalty_points || 0,
            label: "Loyalty Points",
          },
          {
            icon: FiAward,
            bg: "bg-indigo-50 text-indigo-600",
            value: overview?.member_tier || "None",
            label: "Member Tier",
          },
        ].map(({ icon: Icon, bg, value, label }) => (
          <div
            key={label}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${bg}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{value}</h3>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link
            to="/account/dashboard/orders"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <span>View All</span>
            <FiChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="px-6 pb-6 space-y-3">
          {orders.slice(0, 3).map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              ngn={ngn}
              onView={() => {
                setSelectedOrder(o);
                setShowOrderModal(true);
              }}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/menu"
            className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4 hover:bg-gray-50"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">Order Again</div>
              <div className="text-xs text-gray-500">Browse our menu</div>
            </div>
          </Link>
          <Link
            to="/loyalty-board"
            className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4 hover:bg-gray-50"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center">
              <FiGift className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">Rewards</div>
              <div className="text-xs text-gray-500">View your points</div>
            </div>
          </Link>
        </div>
      </div>

      {showOrderModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          ngn={ngn}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}

export default OverviewPage;

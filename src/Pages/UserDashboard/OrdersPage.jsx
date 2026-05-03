import { useState, useEffect } from "react";
import { OrderCard, OrderDetailsModal } from "../../Components/UserDashboard/shared";
import { ngn } from "../../Components/UserDashboard/shared/utils";
import api from "../../utils/api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/customer/orders");
        setOrders(data.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium tracking-wide">
          Loading Orders...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Order History</h2>
        </div>
        <div className="px-6 pb-6 space-y-4">
          {orders.map((o) => (
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
    </>
  );
}

export default OrdersPage;

import { Link } from "react-router-dom";

const OrderCard = ({ order: o, ngn, onView }) => (
  <div className="rounded-2xl border border-gray-100 p-4">
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{o.order_number}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(o.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {o.order_items?.length || 0} items
        </p>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-orange-500">
          {ngn(o.final_amount)}
        </div>
        <div className="text-xs text-gray-500">
          {o.order_type.charAt(0).toUpperCase() + o.order_type.slice(1)}
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={onView}
            className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 text-xs"
          >
            View Details
          </button>
          <Link
            to="/menu"
            className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs"
          >
            Order Again
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default OrderCard;

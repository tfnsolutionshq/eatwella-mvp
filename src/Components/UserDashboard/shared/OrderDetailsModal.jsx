import { FiX } from "react-icons/fi";

const getItemSubtotal = (item) =>
  Number(item.subtotal) + Number(item.packaging_price ?? 0) * item.quantity;

const getOrderItemsTotal = (orderItems = []) =>
  orderItems.reduce((sum, item) => sum + getItemSubtotal(item), 0);

const OrderDetailsModal = ({ order: o, ngn, onClose }) => {
  const itemsTotal = getOrderItemsTotal(o.order_items);
  const discountAmt = Number(o.discount_amount || 0);
  const deliveryFee = Number(o.delivery_fee || 0);
  const taxAmount = Number(o.tax_amount || 0);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10 flex items-center justify-between">
          <h3 className="text-lg font-bold">Order Details</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Order Number", value: o.order_number },
              { label: "Order Type", value: o.order_type, capitalize: true },
              {
                label: "Payment Type",
                value: o.payment_type,
                capitalize: true,
              },
              {
                label: "Date",
                value: new Date(o.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }),
              },
              ...(o.table_number
                ? [{ label: "Table Number", value: o.table_number }]
                : []),
            ].map(({ label, value, capitalize }) => (
              <div key={label}>
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p
                  className={`font-semibold text-sm ${capitalize ? "capitalize" : ""}`}
                >
                  {value}
                </p>
              </div>
            ))}
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
              </span>
            </div>
          </div>

          {o.delivery_address && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Delivery Address</p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm">{o.delivery_address}</p>
                {(o.delivery_city || o.delivery_zip) && (
                  <p className="text-sm">
                    {[o.delivery_city, o.delivery_zip]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold mb-3">Order Items</p>
            <div className="space-y-3">
              {o.order_items?.map((item) => {
                const itemSubtotal = getItemSubtotal(item);
                const packagingPrice = Number(item.packaging_price ?? 0);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <img
                      src={
                        item.menu?.images?.[0] ||
                        "https://via.placeholder.com/80"
                      }
                      alt={item.menu?.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{item.menu?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {ngn(item.price)} × {item.quantity}
                      </p>
                      {item.packaging && packagingPrice > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5 capitalize">
                          Packaging: {item.packaging.size_name} (+
                          {ngn(packagingPrice)} / item)
                        </p>
                      )}
                    </div>
                    <p className="font-bold text-orange-500 shrink-0">
                      {ngn(itemSubtotal)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items Total</span>
              <span className="font-semibold">{ngn(itemsTotal)}</span>
            </div>
            {discountAmt > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span className="font-semibold">-{ngn(discountAmt)}</span>
              </div>
            )}
            {deliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">{ngn(deliveryFee)}</span>
              </div>
            )}
            {o.tax_details &&
              Object.entries(o.tax_details).map(([taxName, tax]) => (
                <div key={taxName} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {taxName}{" "}
                    <span className="text-gray-400 text-xs">({tax.rate}%)</span>
                  </span>
                  <span className="font-semibold">{ngn(tax.amount)}</span>
                </div>
              ))}
            {!o.tax_details && taxAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">{ngn(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-3 border-t">
              <span>Final Amount</span>
              <span className="text-orange-500">{ngn(o.final_amount)}</span>
            </div>
          </div>

          {o.invoice && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Invoice Details</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Invoice #:</span>
                  <span className="font-semibold ml-2">
                    {o.invoice.invoice_number}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-semibold ml-2 capitalize">
                    {o.invoice.payment_status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;

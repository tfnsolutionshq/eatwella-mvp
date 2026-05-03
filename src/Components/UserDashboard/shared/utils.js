export const getItemSubtotal = (item) =>
  Number(item.subtotal) + Number(item.packaging_price ?? 0) * item.quantity;

export const getOrderItemsTotal = (orderItems = []) =>
  orderItems.reduce((sum, item) => sum + getItemSubtotal(item), 0);

export const ngn = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(Math.ceil(Number(amount)));

import { BiBasket } from "react-icons/bi";
import { useLocation, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

function FloatingCartButton() {
  const location = useLocation();
  const { cartItemCount } = useCart();

  // Pages where the floating cart should NOT appear
  const excludedPaths = ["/payment", "/order-type", "/receipt", "/cart"];

  // Also exclude admin pages
  const isExcluded =
    excludedPaths.includes(location.pathname) ||
    location.pathname.startsWith("/receipt") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/attendant") ||
    location.pathname.startsWith("/supervisor") ||
    location.pathname.startsWith("/delivery-agent");

  if (isExcluded) {
    return null;
  }

  return (
    <NavLink
      to="/cart"
      className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-l-xl shadow-lg z-50 transition-colors"
      aria-label="View Cart"
    >
      <div className="flex items-center justify-center gap-1">
        <div className="relative mr-2">
          <BiBasket className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-orange-500">
              {cartItemCount}
            </span>
          )}
        </div>
        <div className="text-sm font-medium writing-mode-vertical text-orientation-upright hidden lg:block">
          <p className="text-left">
            Your
            <br /> Food Basket
          </p>
        </div>
      </div>
    </NavLink>
  );
}

export default FloatingCartButton;

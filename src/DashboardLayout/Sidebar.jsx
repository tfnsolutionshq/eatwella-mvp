import {
  FiGrid,
  FiShoppingCart,
  FiCalendar,
  FiCreditCard,
  FiPercent,
  FiSettings,
  FiX,
  FiMenu,
  FiLogOut,
  FiUsers,
  FiMapPin,
  FiBriefcase,
  FiAward,
  FiPackage,
  FiBell,
  FiHome,
} from "react-icons/fi";
import { MdRestaurant, MdQrCodeScanner, MdBikeScooter } from "react-icons/md";
import {
  Building,
  DollarSign,
  Tag,
  FileText,
  UserCheck,
  Map,
  MapPin,
  Store,
  Receipt,
  Shield,
  TrendingUp,
  Utensils,
  Badge,
  PiggyBank,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  isOpen,
  onToggle,
  isCollapsed,
  onCollapseToggle,
}) {
  const navigate = useNavigate();
  const { logout, user, routePrefix } = useAuth();

  const p = routePrefix;

  const location = useLocation();

  const allMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: FiGrid,
      path: "/admin/dashboard",
      roles: ["admin"],
    },
    {
      id: "orders",
      label: "Orders",
      icon: FiShoppingCart,
      path: `${p}/orders`,
      roles: ["admin", "supervisor", "attendant", "delivery_agent", "kitchen"],
    },
    {
      id: "bank-details",
      label: "Bank Details",
      icon: PiggyBank,
      path: "/admin/bank-details",
      roles: ["delivery_agent"],
    },
    {
      id: "menu",
      label: "Menu Management",
      icon: Utensils,
      path:
        user?.role === "store_keeper" ? "/store-keeper/menu" : "/admin/menu",
      roles: ["admin", "store_keeper"],
    },
    {
      id: "outlet-management",
      label: "Outlet Management",
      icon: FiHome,
      path: "/admin/outlet-management",
      roles: ["admin"],
    },
    {
      id: "food-packaging",
      label: "Food Packaging",
      icon: FiPackage,
      path: "/admin/food-packaging",
      roles: ["admin"],
    },
    {
      id: "users",
      label: "Users",
      icon: FiUsers,
      path: "/admin/users",
      roles: ["admin"],
    },
    {
      id: "account-management",
      label: "Account Management",
      icon: PiggyBank,
      path: "/admin/account-management",
      roles: ["admin"],
    },
    {
      id: "rider-management",
      label: "Rider Management",
      icon: MdBikeScooter,
      path: "/admin/rider-management",
      roles: ["admin"],
    },
    {
      id: "locations",
      label: "Locations",
      icon: MapPin,
      path: "/admin/locations",
      roles: ["admin"],
    },
    {
      id: "campaigns",
      label: "Campaigns",
      icon: FiBell,
      path: "/admin/campaigns",
      roles: ["admin"],
    },
    {
      id: "vacancies",
      label: "Vacancies",
      icon: UserCheck,
      path: "/admin/careers",
      roles: ["admin"],
    },
    {
      id: "career-openings",
      label: "Career Openings",
      icon: TrendingUp,
      path: "/admin/career-openings",
      roles: ["admin"],
    },
    {
      id: "loyalty-settings",
      label: "Loyalty Settings",
      icon: Badge,
      path: "/admin/loyalty-settings",
      roles: ["admin"],
    },
    // {
    //   id: "meal-plans",
    //   label: "Meal Plans",
    //   icon: FiCalendar,
    //   path: "/admin/meal-plans",
    //   roles: ["admin"],
    // },
    // {
    //   id: "voucher",
    //   label: "Voucher Redemption",
    //   icon: MdQrCodeScanner,
    //   path: "/admin/voucher-redemption",
    //   roles: ["admin"],
    // },
    {
      id: "payments",
      label: "Payments",
      icon: Receipt,
      path: `${p}/payments`,
      roles: ["admin"],
    },
    {
      id: "tax-vat",
      label: "Tax & VAT",
      icon: FileText,
      path: "/admin/tax-vat",
      roles: ["admin"],
    },
    {
      id: "discounts",
      label: "Discounts",
      icon: Tag,
      path: "/admin/discounts",
      roles: ["admin"],
    },
    {
      id: "settings",
      label: "Settings",
      icon: FiSettings,
      path: "/admin/settings",
      roles: ["admin"],
    },
  ];

  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  const handleNavigation = (item) => {
    navigate(item.path);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <>
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-[270px]"
        } bg-white border-r border-gray-100 transition-all duration-300 flex flex-col h-full fixed lg:relative z-30 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white">
            <MdRestaurant className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col flex-1">
              <span className="text-xl font-bold text-gray-900 leading-tight">
                Eatwella
              </span>
              <span className="text-xs text-gray-500">Admin Portal</span>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav
          className={`flex-1 py-4 space-y-2 overflow-y-auto ${isCollapsed ? "px-2" : "px-4"}`}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center gap-3 ${isCollapsed ? "px-2" : "px-4"} py-3 rounded-xl transition-colors text-sm font-medium ${
                  isActive
                    ? "bg-orange-50 text-orange-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={item.label}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-orange-500" : "text-gray-500"}`}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <div
          className={`${isCollapsed ? "px-2" : "px-4"} py-4 border-t border-gray-100`}
        >
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 ${isCollapsed ? "px-2" : "px-4"} py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors`}
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-20"
          onClick={onToggle}
        />
      )}
    </>
  );
}

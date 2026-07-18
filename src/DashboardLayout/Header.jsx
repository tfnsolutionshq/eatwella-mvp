import { FiUser, FiMenu } from "react-icons/fi";
import { MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header({ onMenuClick }) {
  const { user, outlet } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
      {/* Menu Button */}
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Right Section - User Profile */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center gap-3 ml-auto">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 leading-none">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {user.role.includes("_")
                ? user.role
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())
                : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
            {/* Outlet badge — shown for supervisor and other outlet-scoped roles */}
            {user.role !== "admin" && outlet && (
              <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-xs font-medium text-orange-600">
                <MapPin className="w-3 h-3 shrink-0" />
                {outlet.name}
              </span>
            )}
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-600">
            <FiUser className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}

import { NavLink } from "react-router-dom";

const DashboardSidebar = () => {
  const navItems = [
    { key: "overview", label: "Overview", path: "/account/dashboard/overview" },
    { key: "orders", label: "Orders", path: "/account/dashboard/orders" },
    { key: "profile", label: "Profile & Address", path: "/account/dashboard/profile" },
    { key: "settings", label: "Settings", path: "/account/dashboard/settings" },
  ];

  return (
    <aside className="lg:col-span-3">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-3 md:p-4">
        <nav className="space-y-1">
          {navItems.map(({ key, label, path }) => (
            <NavLink
              key={key}
              to={path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${
                  isActive
                    ? "bg-orange-50 text-orange-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center ${
                      isActive ? "bg-orange-100" : "bg-gray-100"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-orange-500" : "bg-gray-400"
                      }`}
                    />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

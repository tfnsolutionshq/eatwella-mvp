import { useState, useEffect } from "react";
import { BiBasket } from "react-icons/bi";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiLoader,
} from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import api from "../../utils/api";
import logo from "../../assets/eatwellalogo.png";

function isActiveCampaign(c) {
  const now = new Date();
  return (
    c.status === "published" &&
    new Date(c.start_date) <= now &&
    new Date(c.end_date) >= now
  );
}

function CampaignBanner({ campaigns, isLoading }) {
  const banners = campaigns.filter(
    (c) => isActiveCampaign(c) && c.type === "banner",
  );

  if (isLoading) {
    return (
      <div className="w-full bg-gray-100 animate-pulse flex items-center justify-center py-2.5">
        <div className="h-4 w-48 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!banners.length) return null;

  return (
    <div className="bg-green-50 border-b border-green-100 py-2">
      <Marquee speed={50} gradient={false} pauseOnHover>
        {banners.map((campaign) => (
          <Link
            to={campaign.url || "#"}
            target={campaign.url ? "_blank" : "_self"}
            key={campaign.id}
            className="mx-10 text-green-700 font-medium text-sm hover:underline"
          >
            📢 {campaign.title} — {campaign.brief}
          </Link>
        ))}
      </Marquee>
    </div>
  );
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(true);
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsCampaignsLoading(true);
        const { data } = await api.get("/campaigns");
        const list = Array.isArray(data) ? data : (data.data ?? []);
        setCampaigns(list);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      } finally {
        setIsCampaignsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const avatarUrl =
    user?.avatar_url || user?.avatar || user?.profile_image || user?.image;
  const avatarInitial = (user?.name || user?.email || "")
    .charAt(0)
    .toUpperCase();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/customer/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      logout();
      setIsLoggingOut(false);
      navigate("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-green-600">
      <CampaignBanner campaigns={campaigns} isLoading={isCampaignsLoading} />
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Eatwella Logo" className=" h-9" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-white font-medium transition-colors hover:text-green-100 inline-flex px-3 py-1 rounded-full ${isActive ? "ring-2 ring-white" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `text-white font-medium transition-colors hover:text-green-100 inline-flex px-3 py-1 rounded-full ${isActive ? "ring-2 ring-white" : ""}`
            }
          >
            Menu
          </NavLink>
          <NavLink
            to="/riders"
            className={({ isActive }) =>
              `text-white font-medium transition-colors hover:text-green-100 inline-flex px-3 py-1 rounded-full ${isActive ? "ring-2 ring-white" : ""}`
            }
          >
            Riders
          </NavLink>
          <div className="relative">
            <button
              onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
              className="text-white font-medium transition-colors hover:text-green-100 inline-flex items-center gap-1 px-3 py-1 rounded-full"
            >
              More
              <FiChevronDown
                className={`w-4 h-4 transition-transform ${isMoreDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isMoreDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <NavLink
                  to="/careers"
                  onClick={() => setIsMoreDropdownOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors ${isActive ? "bg-green-50 text-green-700" : ""}`
                  }
                >
                  Careers
                </NavLink>
                <NavLink
                  to="/track-order"
                  onClick={() => setIsMoreDropdownOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors ${isActive ? "bg-green-50 text-green-700" : ""}`
                  }
                >
                  Track Order
                </NavLink>
              </div>
            )}
          </div>
          <NavLink
            to="/mobile-app"
            className={({ isActive }) =>
              `text-white font-medium transition-colors hover:text-green-100 inline-flex px-3 py-1 rounded-full ${isActive ? "ring-2 ring-white" : ""}`
            }
          >
            Mobile App
          </NavLink>
          {!user && (
            <Link
              to="/account/login"
              className="text-white font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors border border-white/30"
            >
              Login
            </Link>
          )}
          <NavLink
            to="/cart"
            className="bg-orange-500 hover:bg-orange-600 text-white p-3  rounded-full shadow-lg transition-colors flex ml-3"
          >
            <BiBasket className="w-6 h-6 mr-3" />
            {cartItemCount > 0 ? <span>{cartItemCount}</span> : <span>0</span>}
          </NavLink>
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-orange-500 overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || user?.email || "User avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    avatarInitial
                  )}
                </div>
                <span className="text-white text-sm font-medium">
                  {user.email}
                </span>
                <FiChevronDown className="text-white w-4 h-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/account/dashboard/overview"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      if (!isLoggingOut) {
                        handleLogout();
                      }
                    }}
                    disabled={isLoggingOut}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isLoggingOut ? (
                      <FiLoader className="w-4 h-4 animate-spin" />
                    ) : (
                      <FiLogOut className="w-4 h-4" />
                    )}
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-4">
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-8 h-8 rounded-full bg-orange-500 overflow-hidden flex items-center justify-center text-white font-bold text-sm"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name || user?.email || "User avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  avatarInitial
                )}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/account/dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      if (!isLoggingOut) {
                        handleLogout();
                      }
                    }}
                    disabled={isLoggingOut}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isLoggingOut ? (
                      <FiLoader className="w-4 h-4 animate-spin" />
                    ) : (
                      <FiLogOut className="w-4 h-4" />
                    )}
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              )}
            </div>
          )}
          <button onClick={toggleMenu} className="text-white p-2">
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-8">
              <img src={logo} alt="Eatwella Logo" className="h-8" />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <NavLink
                to="/"
                end
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-gray-800 hover:text-orange-500 font-medium text-lg transition-colors inline-flex px-3 py-1 rounded-full ${isActive ? "ring-2 ring-white" : ""}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/menu"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-gray-800 hover:text-orange-500 font-medium text-lg transition-colors inline-flex px-3 py-1 rounded-full ${isActive ? "ring-2 ring-white" : ""}`
                }
              >
                Menu
              </NavLink>
              <NavLink
                to="/riders"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-gray-800 hover:text-orange-500 font-medium text-lg transition-colors inline-flex px-3 py-1 rounded-full ${isActive ? "ring-2 ring-white" : ""}`
                }
              >
                Riders
              </NavLink>
              <div className="flex flex-col">
                <button
                  onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
                  className="text-gray-800 hover:text-orange-500 font-medium text-lg transition-colors inline-flex items-center gap-2 px-3 py-1 rounded-full text-left"
                >
                  More
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform ${isMobileMoreOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isMobileMoreOpen
                      ? "max-h-32 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-col gap-2 pl-4 pt-2">
                    <NavLink
                      to="/careers"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileMoreOpen(false);
                      }}
                      className={({ isActive }) =>
                        `text-gray-800 hover:text-orange-500 font-medium transition-colors inline-flex px-3 py-1 rounded-full ${isActive ? "ring-2 ring-white" : ""}`
                      }
                    >
                      Careers
                    </NavLink>
                    <NavLink
                      to="/track-order"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileMoreOpen(false);
                      }}
                      className={({ isActive }) =>
                        `text-gray-800 hover:text-orange-500 font-medium transition-colors inline-flex px-3 py-1 rounded-full ${isActive ? "ring-2 ring-white" : ""}`
                      }
                    >
                      Track Order
                    </NavLink>
                  </div>
                </div>
              </div>
              <NavLink
                to="/mobile-app"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-gray-800 hover:text-orange-500 font-medium text-lg transition-colors inline-flex px-3 py-1 rounded-full ${isActive ? "ring-2 ring-white" : ""}`
                }
              >
                Mobile App
              </NavLink>
              {!user && (
                <Link
                  to="/account/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-orange-500 hover:text-orange-600 font-bold text-lg transition-colors bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-full border-2 border-orange-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

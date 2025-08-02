import { AccountCircleOutlined, DeliveryDiningOutlined } from "@mui/icons-material";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { ChevronDown, Heart, LogIn, Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCSRFToken } from "../utils/csrf";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getSession();
  }, []);

  const getSession = async () => {

    try {
      const res = await axios.get("https://localhost:3000/api/creds/me", { withCredentials: true });
      setIsLoggedIn(!!res.data.id);
      setUserRole(res.data.role || null);
      if (res.data.id) {
        fetchCartCount(res.data.id);
        fetchWishlistCount(res.data.id);
      }

    } catch {
      setIsLoggedIn(false);
      setUserRole(null);
      setCartCount(0);
      setWishlistCount(0);
    }
  };

  const fetchCartCount = async (userId) => {
    try {
      const response = await axios.get(`https://localhost:3000/api/cart/user/${userId}`, {
        withCredentials: true,
      });
      const items = response.data[0]?.items || [];
      const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(totalItems);
    } catch {
      // setCartCount(0);
    }
  };

  const fetchWishlistCount = async (userId) => {
    try {
      const response = await axios.get(`https://localhost:3000/api/wishlist`, {
        params: { userId },
        withCredentials: true,
      });
      setWishlistCount(response.data.wishlist.length || 0);
    } catch {
      setWishlistCount(0);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      // Use axios without explicit config to let interceptor handle credentials and CSRF
      await axios.post("https://localhost:3000/api/creds/logout", {});

      // Clear CSRF token on logout
      clearCSRFToken();

      setIsLoggedIn(false);
      setCartCount(0);
      setWishlistCount(0);
      setUserRole(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still proceed with frontend logout even if backend call fails
      clearCSRFToken();
      setIsLoggedIn(false);
      setCartCount(0);
      setWishlistCount(0);
      setUserRole(null);
      navigate("/login");
    }
  };

  const handleLogoClick = () => {
    if (userRole === "admin") {
      navigate("/admindashboard");
    } else {
      navigate("/");
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

 return (
  <header className="w-full fixed top-0 left-0 z-20 bg-gradient-to-r from-white via-gray-100 to-white shadow-lg border-b">
    <div className="flex h-20 items-center justify-between px-4 md:px-16">
      <a href="#" onClick={handleLogoClick} className="flex items-center">
        {/* <img src="" alt="CarryLuxe" className="h-14 w-auto drop-shadow-lg" /> */}
        <h1 className="text-2xl font-bold text-emerald-700 ml-2">CarryLuxe</h1>

      </a>
      <div className="hidden md:flex flex-1 justify-center mx-8">
        <nav>
          <ul className="flex items-center gap-7">
            <li className="font-semibold text-gray-700 hover:text-emerald-700 transition"><a href="/">Home</a></li>
            <li>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="flex items-center font-semibold text-gray-700 hover:text-emerald-700 transition gap-1">
                  Categories <ChevronDown size={18} />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="bg-white rounded-lg shadow-lg mt-2 p-2 w-44">
                    <a href="/menbags" className="block px-4 py-2 hover:bg-gray-50 rounded">Men Bags</a>
                    <a href="/womenbags" className="block px-4 py-2 hover:bg-gray-50 rounded">Woman Bags</a>
                    <a href="/schoolbags" className="block px-4 py-2 hover:bg-gray-50 rounded">School Bags</a>
                    <a href="/officebags" className="block px-4 py-2 hover:bg-gray-50 rounded">Office Bags</a>
                    <a href="/travelbags" className="block px-4 py-2 hover:bg-gray-50 rounded">Travel Bags</a>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </li>
            <li className="font-semibold text-gray-700 hover:text-emerald-700 transition"><a href="/FAQ">FAQ's</a></li>
            <li className="font-semibold text-gray-700 hover:text-emerald-700 transition"><a href="/contactus">Contact Us</a></li>
            <li className="ml-4 font-bold text-emerald-700">+977 9812345678</li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative w-40 md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-4 pr-10 py-2 h-10 border border-gray-300 rounded-2xl shadow-inner focus:ring-2 focus:ring-emerald-300 transition"
            placeholder="Search for items..."
          />
          <button
            onClick={handleSearch}
            className="absolute right-1 top-1 bottom-1 bg-emerald-500 hover:bg-emerald-600 rounded-full p-1 flex items-center justify-center"
          >
            <img
              src="https://img.icons8.com/?size=100&id=95149&format=png&color=000000"
              alt="search"
              className="h-6 w-6"
            />
          </button>
        </div>
        <div className="hidden md:flex items-center gap-4 ml-4">
          <a href="/myprofile" className="flex flex-col items-center group">
            <AccountCircleOutlined className="text-gray-700 group-hover:text-emerald-600" />
            <span className="text-xs group-hover:text-emerald-600">Account</span>
          </a>
          <a href="/mywishlist" className="relative flex flex-col items-center group">
            <Heart className="text-gray-700 group-hover:text-emerald-600" />
            <span className="text-xs group-hover:text-emerald-600">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </a>
          <a href="/mycart" className="relative flex flex-col items-center group">
            <ShoppingCart className="text-gray-700 group-hover:text-emerald-600" />
            <span className="text-xs group-hover:text-emerald-600">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>
          <a href="/myorders" className="flex flex-col items-center group">
            <DeliveryDiningOutlined className="text-gray-700 group-hover:text-emerald-600" />
            <span className="text-xs group-hover:text-emerald-600">My Orders</span>
          </a>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center group hover:bg-red-200 rounded-lg px-2 py-1"
            >
              <LogIn className="text-gray-700 group-hover:text-red-600" />
              <span className="text-xs group-hover:text-red-600">Logout</span>
            </button>
          ) : (
            <a href="/login" className="flex flex-col items-center group hover:bg-blue-200 rounded-lg px-2 py-1">
              <LogIn className="text-gray-700 group-hover:text-blue-600" />
              <span className="text-xs group-hover:text-blue-600">Login</span>
            </a>
          )}
        </div>
        <button className="md:hidden ml-2" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </div>
    <nav className={`md:hidden transition-all duration-200 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"} bg-white shadow-md`}>
      <ul className="flex flex-col gap-2 px-8 py-6">
        <li><a href="/" className="block text-gray-800 hover:text-emerald-700 font-medium">Home</a></li>
        <li>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex items-center text-gray-800 font-medium hover:text-emerald-700">
              Categories <ChevronDown size={17} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white rounded-lg shadow-md mt-2 p-1 w-40">
                <a href="/menbags" className="block px-4 py-2 hover:bg-gray-100">Men Bags</a>
                <a href="/womenbags" className="block px-4 py-2 hover:bg-gray-100">Woman Bags</a>
                <a href="/schoolbags" className="block px-4 py-2 hover:bg-gray-100">School Bags</a>
                <a href="/officebags" className="block px-4 py-2 hover:bg-gray-100">Office Bags</a>
                <a href="/travelbags" className="block px-4 py-2 hover:bg-gray-100">Travel Bags</a>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </li>
        <li><a href="/FAQ" className="block text-gray-800 hover:text-emerald-700 font-medium">FAQ's</a></li>
        <li><a href="/contactus" className="block text-gray-800 hover:text-emerald-700 font-medium">Contact Us</a></li>
        <li className="block text-emerald-700 font-bold">+977 9812345678</li>
        <hr className="my-1" />
        <a href="/myprofile" className="flex items-center gap-2 text-gray-800 hover:text-emerald-600 font-medium">
          <AccountCircleOutlined /> Account
        </a>
        <a href="/mywishlist" className="flex items-center gap-2 relative text-gray-800 hover:text-emerald-600 font-medium">
          <Heart />
          Wishlist
          {wishlistCount > 0 && (
            <span className="absolute -top-1 left-12 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </a>
        <a href="/mycart" className="flex items-center gap-2 relative text-gray-800 hover:text-emerald-600 font-medium">
          <ShoppingCart />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-1 left-12 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </a>
        <a href="/myorders" className="flex items-center gap-2 text-gray-800 hover:text-emerald-600 font-medium">
          <DeliveryDiningOutlined />
          My Orders
        </a>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-medium mt-2">
            <LogIn /> Logout
          </button>
        ) : (
          <a href="/login" className="flex items-center gap-2 text-blue-600 font-medium mt-2">
            <LogIn /> Login
          </a>
        )}
      </ul>
    </nav>
  </header>
);
}
export default Navbar;

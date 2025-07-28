import { AccountCircleOutlined, DeliveryDiningOutlined } from "@mui/icons-material";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { ChevronDown, Heart, LogIn, Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    await axios.post("https://localhost:3000/api/creds/logout", {}, { withCredentials: true });
    setIsLoggedIn(false);
    setCartCount(0);
    setWishlistCount(0);
    setUserRole(null);
    navigate("/login");
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
    <header className="w-full border-b fixed z-10 bg-white">
      <div className="flex h-16 items-center justify-between border-b px-4 md:px-6">
        <a href="#" onClick={handleLogoClick} className="flex items-center ml-2 md:ml-20">
          <img src="../src/assets/images/logo.png" alt="Pharm Logo" className="h-12 md:h-25 w-auto" />
        </a>
        <div className="relative w-full max-w-xl mx-4 flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-4 pr-12 py-2 h-11 border border-gray-300 rounded-l shadow-sm focus:outline-none"
            placeholder="Search for items ..."
          />
          <button
            onClick={handleSearch}
            className="bg-red-500 px-3 rounded-r flex items-center justify-center"
          >
            <img
              src="https://img.icons8.com/?size=100&id=95149&format=png&color=000000"
              alt="search"
              className="h-6 w-6"
            />
          </button>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <a href="/myprofile" className="flex items-center space-x-1">
            <AccountCircleOutlined />
            <span className="text-sm">Account</span>
          </a>
          <a href="/mywishlist" className="flex items-center space-x-1 px-2 py-1 relative">
            <Heart />
            <span className="text-sm">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </a>
          <a href="/mycart" className="flex items-center space-x-1 rounded-xl px-2 py-1 relative">
            <ShoppingCart />
            <span className="text-sm">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>
          <a href="/myorders" className="flex items-center space-x-1 rounded-xl px-2 py-1">
            <DeliveryDiningOutlined />
            <span className="text-sm">My Orders</span>
          </a>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:bg-red-300 rounded-xl px-2 py-1"
            >
              <LogIn />
              <span className="text-sm">Logout</span>
            </button>
          ) : (
            <a href="/login" className="flex items-center space-x-1 hover:bg-blue-300 rounded-xl px-2 py-1">
              <LogIn />
              <span className="text-sm">Login</span>
            </a>
          )}
        </div>
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      <nav className={`${isOpen ? "block" : "hidden"} md:flex h-10 items-center justify-center px-4 md:px-6`}>
        <ul className="flex flex-col md:flex-row items-start md:items-center bg-white gap-3 py-3 md:py-0">
          <li className="text-sm font-medium hover:text-emerald-600">
            <a href="/">Home</a>
          </li>
          <li>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center text-sm font-medium hover:text-emerald-600">
                Categories <ChevronDown size={19} />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="absolute bg-white shadow-lg rounded-md mt-2 w-40 p-1">
                  <a href="/menbags" className="flex justify-between px-4 py-2 text-sm hover:bg-gray-100">
                    Men Bags
                  </a>
                  <a href="/womenbags" className="flex justify-between px-4 py-2 text-sm hover:bg-gray-100">
                    Woman Bags
                  </a>
                  <a href="/schoolbags" className="flex justify-between px-4 py-2 text-sm hover:bg-gray-100">
                    School Bags
                  </a>
                  <a href="/officebags" className="flex justify-between px-4 py-2 text-sm hover:bg-gray-100">
                    Office Bags
                  </a>
                  <a href="/travelbags" className="flex justify-between px-4 py-2 text-sm hover:bg-gray-100">
                    Travel Bags
                  </a>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </li>
          <li>
            <a href="/FAQ" className="text-sm font-medium hover:text-emerald-600">
              FAQ's
            </a>
          </li>
          <li>
            <a href="/contactus" className="text-sm font-medium hover:text-emerald-600">
              Contact Us
            </a>
          </li>
          <li className="text-sm font-medium hover:text-emerald-600">
            +977 9812345678
          </li>
        </ul>
        {isOpen && (
          <div className="flex flex-col gap-3 px-6 pb-4 md:hidden bg-white">
            <a href="/myprofile" className="flex items-center space-x-2">
              <AccountCircleOutlined />
              <span className="text-sm">Account</span>
            </a>
            <a href="/mywishlist" className="flex items-center space-x-2 relative">
              <Heart />
              <span className="text-sm">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 left-6 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </a>
            <a href="/mycart" className="flex items-center space-x-2 relative">
              <ShoppingCart />
              <span className="text-sm">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 left-6 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>
            <DeliveryDiningOutlined />
            <a href="/myorders" className="flex items-center space-x-2 relative">
              <span className="text-sm">My Orders</span>
            </a>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600"
              >
                <LogIn />
                <span className="text-sm">Logout</span>
              </button>
            ) : (
              <a href="/login" className="flex items-center space-x-2">
                <LogIn />
                <span className="text-sm">Login</span>
              </a>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
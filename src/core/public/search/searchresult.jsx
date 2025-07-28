
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilled } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { AddShoppingCartOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/navbar";
import {
  useAddToWishlist,
  useCartprod,
  useGetWishlist,
  useRemoveFromWishlist,
} from "../product/productquery";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userId, setUserId] = useState(null);

  const [filters, setFilters] = useState({
    category: '',
    productType: '',
    priceMin: '',
    priceMax: '',
    brand: '',
    sortBy: 'name'
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    productType: true,
    price: true,
    brand: true
  });

  const location = useLocation();
  const { data: wishlist, isLoading: isWishlistLoading } = useGetWishlist();
  const { mutate: addToCart, isLoading: isAddingToCart } = useCartprod();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const filterOptions = {
    categories: ['Wallet', 'School Bag', 'Office Bag', 'Trekking Bag', 'Women Bag', 'Sports Bag'],
    productTypes: ['Backpack', 'Handbag', 'Tote Bag', 'Party Bag', 'Travel Bag', 'School Bags'],
    brands: ['luxecarry', 'Nike', 'Adidas', 'Puma', 'Gucci', 'Prada', 'Louis Vuitton', 'Coach', 'Michael Kors'],
    sortOptions: [
      { value: 'name', label: 'Name A-Z' },
      { value: 'price-low', label: 'Price Low to High' },
      { value: 'price-high', label: 'Price High to Low' },
      { value: 'newest', label: 'Newest First' }
    ]
  };

  // Get user ID from cookie-based authentication
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("https://localhost:3000/api/creds/me", {
          withCredentials: true,
        });
        setUserId(response.data.id);
      } catch (error) {
        setUserId(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      setSearchQuery(query);
      fetchSearchResults(query);
    }
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [searchResults, filters]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch(
        `https://localhost:3000/api/items/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      toast.error("Failed to fetch search results");
    }
  };

  const applyFilters = () => {
    let filtered = [...searchResults];

    if (filters.category) {
      filtered = filtered.filter(item =>
        item.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.productType) {
      filtered = filtered.filter(item =>
        item.productType?.toLowerCase().includes(filters.productType.toLowerCase()) ||
        item.item_name?.toLowerCase().includes(filters.productType.toLowerCase())
      );
    }

    if (filters.priceMin) {
      filtered = filtered.filter(item => item.item_price >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(item => item.item_price <= parseFloat(filters.priceMax));
    }

    if (filters.brand) {
      filtered = filtered.filter(item =>
        item.brand?.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.item_name.localeCompare(b.item_name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.item_price - b.item_price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.item_price - a.item_price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredResults(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      productType: '',
      priceMin: '',
      priceMax: '',
      brand: '',
      sortBy: 'name'
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleIncrease = (itemId) => {
    const item = filteredResults.find((item) => item._id === itemId);
    if (item) {
      setQuantities((prev) => {
        const currentQuantity = prev[itemId] || 1;
        if (currentQuantity < item.item_quantity) {
          return { ...prev, [itemId]: currentQuantity + 1 };
        }
        return prev;
      });
    }
  };

  const handleDecrease = (itemId) => {
    setQuantities((prev) => {
      const currentQuantity = prev[itemId] || 1;
      if (currentQuantity > 1) {
        return { ...prev, [itemId]: currentQuantity - 1 };
      }
      return prev;
    });
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:3000/api/items/search?query=${query}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      toast.error("Failed to fetch search results");
    }
  };

  const handleAddToCart = (itemId) => {
    setIsAdding(true);
    const quantity = quantities[itemId] || 1;
    
    if (!userId) {
      toast.error("Please log in first.");
      setIsAdding(false);
      return;
    }
    
    addToCart(
      { itemId, quantity },
      {
        onSuccess: () => {
          toast.success("Successfully added item to your cart");
        },
        onError: (error) => {
          console.error("Error adding to cart:", error);
          toast.error(error.response?.data?.message || "Failed to add item to cart");
        },
        onSettled: () => {
          setIsAdding(false);
        }
      }
    );
  };

  const handleToggleWishlist = (productId) => {
    if (!userId) {
      toast.error("Please log in first.");
      return;
    }
    
    const isInWishlist = wishlist?.some((item) => item.productId === productId);
    if (isInWishlist) {
      removeFromWishlist(
        { productId, userId },
        {
          onSuccess: () => toast.success("Removed from wishlist"),
          onError: () => toast.error("Failed to remove from wishlist"),
        }
      );
    } else {
      addToWishlist(
        { productId, userId },
        {
          onSuccess: () => toast.success("Added to wishlist"),
          onError: () => toast.error("Failed to add to wishlist"),
        }
      );
    }
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="pt-32 pb-8 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-center text-3xl font-bold mb-8">What are you looking for?</h1>
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                className="w-full p-4 pl-6 pr-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for ....."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Search className="h-6 w-6 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full px-4 py-8 mx-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">FILTER</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => toggleSection('category')}
                  className="flex justify-between items-center w-full text-left font-semibold text-gray-700 mb-3"
                >
                  Categories
                  {expandedSections.category ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.category && (
                  <div className="space-y-2">
                    {filterOptions.categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={filters.category === category}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">{category}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <button
                  onClick={() => toggleSection('productType')}
                  className="flex justify-between items-center w-full text-left font-semibold text-gray-700 mb-3"
                >
                  Product Type
                  {expandedSections.productType ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.productType && (
                  <div className="space-y-2">
                    {filterOptions.productTypes.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="productType"
                          value={type}
                          checked={filters.productType === type}
                          onChange={(e) => handleFilterChange('productType', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <button
                  onClick={() => toggleSection('price')}
                  className="flex justify-between items-center w-full text-left font-semibold text-gray-700 mb-3"
                >
                  Price
                  {expandedSections.price ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.price && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.priceMin}
                        onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span className="text-gray-500">TO</span>
                      <input
                        type="number"
                        placeholder="1000000"
                        value={filters.priceMax}
                        onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <button
                  onClick={() => toggleSection('brand')}
                  className="flex justify-between items-center w-full text-left font-semibold text-gray-700 mb-3"
                >
                  Brands
                  {expandedSections.brand ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.brand && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Search for..."
                      value={filters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {filterOptions.brands
                        .filter(brand => brand.toLowerCase().includes(filters.brand.toLowerCase()))
                        .map((brand) => (
                          <label key={brand} className="flex items-center">
                            <input
                              type="radio"
                              name="brand"
                              value={brand}
                              checked={filters.brand === brand}
                              onChange={(e) => handleFilterChange('brand', e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-600">{brand}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Products</h2>
                  <p className="text-sm text-gray-600">Items Found: {filteredResults.length}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort By:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                  >
                    {filterOptions.sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              {filteredResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredResults.map((product) => (
                    <Card
                      key={product._id}
                      className="w-full max-w-3xs mx-auto shadow-lg rounded-4xl overflow-hidden cursor-pointer"
                      onClick={() => handleOpenModal(product)}
                    >
                      <CardHeader shadow={false} floated={false} className="h-40">
                        <div className="flex justify-end">
                          <IconButton
                            variant="text"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWishlist(product._id);
                            }}
                            className="p-2"
                          >
                            {wishlist?.some((item) => item.productId === product._id) ? (
                              <HeartFilled className="h-6 w-6 text-red-500" />
                            ) : (
                              <HeartOutline className="h-6 w-6 text-gray-500" />
                            )}
                          </IconButton>
                        </div>
                        <img
                          src={product.image ? `https://localhost:3000/uploads/${product.image}` : '/api/placeholder/300/300'}
                          alt={product.item_name}
                          className="max-h-30 w-full object-contain"
                        />
                      </CardHeader>
                      <CardBody className="p-0">
                        <div className="flex justify-center items-center">
                          <Typography color="blue-gray" className="font-bold text-lg">
                            {product.item_name}
                          </Typography>
                        </div>
                        <Typography
                          color="blue-gray"
                          className="font-bold text-lg flex items-center justify-center"
                        >
                          Price: Rs.{product.item_price}
                        </Typography>
                        <div className="flex justify-center items-center mt-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDecrease(product._id);
                            }}
                            className="bg-gray-300 px-3 py-1 text-lg font-bold text-black"
                            disabled={(quantities[product._id] || 1) <= 1}
                          >
                            -
                          </Button>
                          <span className="mx-10 text-lg font-semibold">
                            {quantities[product._id] || 1}
                          </span>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIncrease(product._id);
                            }}
                            className="bg-gray-300 px-3 py-1 text-lg font-extrabold text-black"
                            disabled={(quantities[product._id] || 1) >= product.item_quantity}
                          >
                            +
                          </Button>
                        </div>
                      </CardBody>
                      <CardFooter className="pt-4 pb-4 px-5 flex">
                        <Button
                          ripple={false}
                          fullWidth={true}
                          className="bg-[#D72638] py-0 rounded-r text-white shadow-md hover:scale-105 transition-transform duration-200 hover:bg-green-300 hover:text-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product._id);
                          }}
                          disabled={isAdding || isAddingToCart}
                        >
                          <ShoppingBagOutlined />
                          Buy Now
                        </Button>
                        <Button
                          ripple={false}
                          fullWidth={true}
                          className="bg-[#333333] rounded-l p-2 flex-1/12 text-white shadow-md hover:scale-105 transition-transform duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product._id);
                          }}
                          disabled={isAdding || isAddingToCart}
                        >
                          <AddShoppingCartOutlined />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No items found matching your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleCloseModal}
          />
          <Dialog open={openModal} handler={handleCloseModal} className="max-w-lg">
            <DialogHeader className="flex justify-between items-center">
              <Typography variant="h5" color="blue-gray">
                {selectedProduct.item_name}
              </Typography>
              <IconButton
                variant="text"
                onClick={() => handleToggleWishlist(selectedProduct._id)}
                className="p-2"
              >
                {wishlist?.some((item) => item.productId === selectedProduct._id) ? (
                  <HeartFilled className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartOutline className="h-6 w-6 text-gray-500" />
                )}
              </IconButton>
            </DialogHeader>
            <DialogBody className="flex flex-col gap-4">
              <img
                src={`https://localhost:3000/uploads/${selectedProduct.image}`}
                alt={selectedProduct.item_name}
                className="w-full h-64 object-contain rounded-lg"
              />
              <Typography color="blue-gray" className="font-bold">
                Price: Rs.{selectedProduct.item_price}
              </Typography>
              <Typography color="blue-gray">
                Available Quantity: {selectedProduct.item_quantity || "N/A"}
              </Typography>
              <Typography color="blue-gray">
                Description: {selectedProduct.description || "No description available"}
              </Typography>
              <div className="flex items-center gap-4">
                <Typography color="blue-gray" className="font-semibold">
                  Quantity:
                </Typography>
                <Button
                  onClick={() => handleDecrease(selectedProduct._id)}
                  className="bg-gray-300 px-3 py-1 text-lg font-bold text-black"
                  disabled={(quantities[selectedProduct._id] || 1) <= 1}
                >
                  -
                </Button>
                <span className="text-lg font-semibold">
                  {quantities[selectedProduct._id] || 1}
                </span>
                <Button
                  onClick={() => handleIncrease(selectedProduct._id)}
                  className="bg-gray-300 px-3 py-1 text-lg font-extrabold text-black"
                  disabled={(quantities[selectedProduct._id] || 1) >= selectedProduct.item_quantity}
                >
                  +
                </Button>
              </div>
            </DialogBody>
            <DialogFooter className="flex gap-4">
              <Button
                variant="outlined"
                color="red"
                onClick={handleCloseModal}
                className="rounded-2xl"
              >
                Close
              </Button>
              <Button
                className="bg-black rounded-2xl text-white hover:bg-green-300 hover:text-black"
                onClick={() => handleToggleWishlist(selectedProduct._id)}
                disabled={isAdding || isAddingToCart}
              >
                <AddShoppingCartOutlined />
                Add to Cart
              </Button>
              <Button
                className="bg-[#D72638] rounded-2xl text-white hover:bg-green-300 hover:text-black"
                onClick={() => handleAddToCart(selectedProduct._id)}
                disabled={isAdding || isAddingToCart}
              >
                <ShoppingBagOutlined />
                Buy Now
              </Button>
            </DialogFooter>
          </Dialog>
        </div>
      )}

      <Toaster
        position="top-right"
        autoClose={2500}
        containerStyle={{
          top: "8rem",
          right: "1rem",
        }}
        hideProgressBar={false}
        className="toast-mt-32"
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default SearchResults;
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
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../../components/footer";
import Navbar from "../../../components/navbar";
import {
  useAddToWishlist,
  useCartprod,
  useGetBabyCareProducts,
  useGetWishlist,
  useRemoveFromWishlist,
} from "./productquery";
import axios from "axios";

// Helper: Get user ID from cookie/session via API (not localStorage)
const getUserId = async () => {
  try {
    const res = await axios.get("https://localhost:3000/api/creds/me", { withCredentials: true });
    return res.data.id;
  } catch {
    return null;
  }
};

export const BabyCare = () => {
  const { data, isLoading, isError } = useGetBabyCareProducts();
  const { data: wishlist, isLoading: isWishlistLoading } = useGetWishlist();
  const [quantities, setQuantities] = useState({});
  const { mutate: addToCart, isLoading: isAddingToCart } = useCartprod();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const handleIncrease = (itemId) => {
    const item = data.find((item) => item._id === itemId);
    if (item) {
      setQuantities((prevQuantities) => {
        const currentQuantity = prevQuantities[itemId] || 1;
        if (currentQuantity < item.item_quantity) {
          return { ...prevQuantities, [itemId]: currentQuantity + 1 };
        }
        return prevQuantities;
      });
    }
  };

  const handleDecrease = (itemId) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[itemId] || 1;
      if (currentQuantity > 1) {
        return { ...prevQuantities, [itemId]: currentQuantity - 1 };
      }
      return prevQuantities;
    });
  };

  const handleAddToCart = async (itemId) => {
    const quantity = quantities[itemId] || 1;
    const userId = await getUserId();
    if (!userId) {
      toast.error("Please log in first.");
      return;
    }
    addToCart(
      { itemId, quantity },
      {
        onSuccess: () => {
          toast.success("Successfully added item to your cart");
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to add the item to your cart");
        },
      }
    );
  };

  const handleBuyNow = async (itemId) => {
    const quantity = quantities[itemId] || 1;
    const userId = await getUserId();
    if (!userId) {
      toast.error("Please log in first.");
      return;
    }
    addToCart(
      { itemId, quantity },
      {
        onSuccess: () => {
          toast.success("Successfully added item to your cart");
          navigate(`/mycart`);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to add the item to your cart");
        },
      }
    );
  };

  const handleToggleWishlist = async (productId) => {
    const userId = await getUserId();
    if (!userId) {
      toast.error("Please log in first.");
      return;
    }
    const isInWishlist = wishlist?.some((item) => item.productId === productId);
    if (isInWishlist) {
      removeFromWishlist(
        { productId },
        {
          onSuccess: () => toast.success("Removed from wishlist"),
          onError: () => toast.error("Failed to remove from wishlist"),
        }
      );
    } else {
      addToWishlist(
        { productId },
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

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>Error fetching data!</div>;
  }
return (
  <div>
    <Navbar />
    <div className="pt-32 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-screen h-full overflow-auto">
      {/* Title */}
      <div className="flex items-center justify-center mb-10">
        <div className="border-t border-emerald-400 w-24"></div>
        <Typography className="mx-14 text-3xl font-extrabold text-emerald-700 tracking-tight drop-shadow">
          Women Bags
        </Typography>
        <div className="border-t border-emerald-400 w-24"></div>
      </div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-6 py-4">
        {(data || []).map((product) => (
          <Card
            key={product._id}
            className="w-full max-w-3xs mx-auto shadow-xl rounded-3xl overflow-hidden cursor-pointer border border-emerald-100 hover:-translate-y-2 hover:shadow-emerald-200 transition"
            onClick={() => handleOpenModal(product)}
          >
            <CardHeader shadow={false} floated={false} className="h-44 bg-gradient-to-b from-emerald-50 to-white flex flex-col justify-between">
              <div className="flex justify-end">
                <IconButton
                  variant="text"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await handleToggleWishlist(product._id);
                  }}
                  className="p-2"
                >
                  {wishlist?.some((item) => item.productId === product._id) ? (
                    <HeartFilled className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartOutline className="h-6 w-6 text-emerald-400" />
                  )}
                </IconButton>
              </div>
              <img
                src={`https://localhost:3000/uploads/${product.image}`}
                alt={product.item_name}
                className="max-h-36 w-full object-contain drop-shadow-md"
              />
            </CardHeader>
            <CardBody className="p-0">
              <div className="flex justify-center items-center mt-2">
                <Typography color="blue-gray" className="font-bold text-lg text-center truncate">
                  {product.item_name}
                </Typography>
              </div>
              <Typography
                color="emerald"
                className="font-bold text-lg flex items-center justify-center text-emerald-700"
              >
                Price: Rs.{product.item_price}
              </Typography>
              <div className="flex justify-center items-center mt-2 gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecrease(product._id);
                  }}
                  className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-lg font-bold shadow hover:bg-emerald-200"
                  disabled={(quantities[product._id] || 1) <= 1}
                >
                  -
                </Button>
                <span className="mx-6 text-lg font-semibold">
                  {quantities[product._id] || 1}
                </span>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIncrease(product._id);
                  }}
                  className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-lg font-bold shadow hover:bg-emerald-200"
                  disabled={(quantities[product._id] || 1) >= product.item_quantity}
                >
                  +
                </Button>
              </div>
            </CardBody>
            <CardFooter className="pt-4 pb-4 flex gap-4 px-6">
              <Button
                ripple={false}
                fullWidth={true}
                className="bg-gradient-to-r from-emerald-700 to-emerald-500 py-2 rounded-xl text-white shadow-md hover:from-green-400 hover:to-green-600 hover:text-black transition"
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleBuyNow(product._id);
                }}
                disabled={isAddingToCart}
              >
                <ShoppingBagOutlined className="mr-2" />
                Buy Now
              </Button>
              <Button
                ripple={false}
                fullWidth={true}
                className="bg-gradient-to-r from-emerald-900 to-emerald-700 p-2 rounded-xl text-white shadow-md hover:from-green-600 hover:to-green-700 hover:text-black transition"
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleAddToCart(product._id);
                }}
                disabled={isAddingToCart}
              >
                <AddShoppingCartOutlined className="mr-1" />
                Add
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <Dialog open={openModal} handler={handleCloseModal} className="max-w-lg" backdropClassName="bg-transparent">
          <DialogHeader className="flex justify-between items-center">
            <Typography variant="h5" color="emerald" className="text-emerald-700">
              {selectedProduct.item_name}
            </Typography>
            <IconButton
              variant="text"
              onClick={async () => await handleToggleWishlist(selectedProduct._id)}
              className="p-2"
            >
              {wishlist?.some((item) => item.productId === selectedProduct._id) ? (
                <HeartFilled className="h-6 w-6 text-red-500" />
              ) : (
                <HeartOutline className="h-6 w-6 text-emerald-400" />
              )}
            </IconButton>
          </DialogHeader>
          <DialogBody className="flex flex-col gap-4">
            <img
              src={`https://localhost:3000/uploads/${selectedProduct.image}`}
              alt={selectedProduct.item_name}
              className="w-full h-64 object-contain rounded-xl bg-emerald-50 border"
            />
            <Typography color="emerald" className="font-bold text-lg text-emerald-700">
              Price: Rs.{selectedProduct.item_price}
            </Typography>
            <Typography color="emerald" className="text-md text-emerald-700">
              Available Quantity: {selectedProduct.item_quantity || "N/A"}
            </Typography>
            <Typography color="blue-gray">
              Description: {selectedProduct.description || "No description available"}
            </Typography>
            <div className="flex items-center gap-4">
              <Typography color="emerald" className="font-semibold">
                Quantity:
              </Typography>
              <Button
                onClick={() => handleDecrease(selectedProduct._id)}
                className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-lg font-bold shadow hover:bg-emerald-200"
                disabled={(quantities[selectedProduct._id] || 1) <= 1}
              >
                -
              </Button>
              <span className="text-lg font-semibold">
                {quantities[selectedProduct._id] || 1}
              </span>
              <Button
                onClick={() => handleIncrease(selectedProduct._id)}
                className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-lg font-bold shadow hover:bg-emerald-200"
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
              className="rounded-xl"
            >
              Close
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-900 to-emerald-700 rounded-xl text-white hover:from-green-600 hover:to-green-700 hover:text-black"
              onClick={async () => await handleAddToCart(selectedProduct._id)}
              disabled={isAddingToCart}
            >
              <AddShoppingCartOutlined className="mr-2" />
              Add to Cart
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-xl text-white hover:from-green-400 hover:to-green-600 hover:text-black"
              onClick={async () => await handleBuyNow(selectedProduct._id)}
              disabled={isAddingToCart}
            >
              <ShoppingBagOutlined className="mr-2" />
              Buy Now
            </Button>
          </DialogFooter>
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
        </Dialog>
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
    <Footer />
  </div>
);
};

// The second export, if you still need Babycare as before (showing first 5 products)
export const Babycare = () => {
  const { data, isLoading, isError } = useGetBabyCareProducts();
  const { data: wishlist, isLoading: isWishlistLoading } = useGetWishlist();
  const { mutate: addToCart, isLoading: isAddingToCart } = useCartprod();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const [quantities, setQuantities] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const getUserId = async () => {
    try {
      const res = await axios.get("https://localhost:3000/api/creds/me", { withCredentials: true });
      return res.data.id;
    } catch {
      return null;
    }
  };

  const featuredProducts = data ? data.slice(0, 5) : [];

  const handleIncrease = (itemId) => {
    const item = data.find((item) => item._id === itemId);
    if (item) {
      setQuantities((prevQuantities) => {
        const currentQuantity = prevQuantities[itemId] || 1;
        if (currentQuantity < item.item_quantity) {
          return { ...prevQuantities, [itemId]: currentQuantity + 1 };
        }
        return prevQuantities;
      });
    }
  };

  const handleDecrease = (itemId) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[itemId] || 1;
      if (currentQuantity > 1) {
        return { ...prevQuantities, [itemId]: currentQuantity - 1 };
      }
      return prevQuantities;
    });
  };

  const handleAddToCart = async (itemId) => {
    const quantity = quantities[itemId] || 1;
    const userId = await getUserId();
    if (!userId) {
      toast.error("Please log in first.");
      return;
    }
    addToCart(
      { itemId, quantity },
      {
        onSuccess: () => {
          toast.success("Successfully added item to your cart");
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to add the item to your cart");
        },
      }
    );
  };

  const handleBuyNow = async (itemId) => {
    const quantity = quantities[itemId] || 1;
    const userId = await getUserId();
    if (!userId) {
      toast.error("Please log in first.");
      return;
    }
    addToCart(
      { itemId, quantity },
      {
        onSuccess: () => {
          toast.success("Successfully added item to your cart");
          navigate(`/mycart`);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to add the item to your cart");
        },
      }
    );
  };

  const handleToggleWishlist = async (productId) => {
    const userId = await getUserId();
    if (!userId) {
      toast.error("Please log in first.");
      return;
    }
    const isInWishlist = wishlist?.some((item) => item.productId === productId);
    if (isInWishlist) {
      removeFromWishlist(
        { productId },
        {
          onSuccess: () => toast.success("Removed from wishlist"),
          onError: () => toast.error("Failed to remove from wishlist"),
        }
      );
    } else {
      addToWishlist(
        { productId },
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

  if (isLoading) {
    return <div>Loading products...</div>;
  }
  if (isError) {
    return <div>Error fetching data!</div>;
  }

return (
  <>
    {/* Section Title */}
    <div className="flex items-center justify-center py-10">
      <div className="border-t border-emerald-400 w-24"></div>
      <Typography className="mx-14 text-3xl font-extrabold text-emerald-700 tracking-tight drop-shadow">
        Women Bags
      </Typography>
      <div className="border-t border-emerald-400 w-24"></div>
    </div>
    {/* Featured Product Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-6 py-4">
      {(featuredProducts || []).map((product) => (
        <Card
          key={product._id}
          className="w-full max-w-3xs mx-auto shadow-xl rounded-3xl overflow-hidden cursor-pointer border border-emerald-100 hover:-translate-y-2 hover:shadow-emerald-200 transition"
          onClick={() => handleOpenModal(product)}
        >
          <CardHeader shadow={false} floated={false} className="h-44 bg-gradient-to-b from-emerald-50 to-white flex flex-col justify-between">
            <div className="flex justify-end">
              <IconButton
                variant="text"
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleToggleWishlist(product._id);
                }}
                className="p-2"
              >
                {wishlist?.some((item) => item.productId === product._id) ? (
                  <HeartFilled className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartOutline className="h-6 w-6 text-emerald-400" />
                )}
              </IconButton>
            </div>
            <img
              src={`https://localhost:3000/uploads/${product.image}`}
              alt={product.item_name}
              className="max-h-36 w-full object-contain drop-shadow-md"
            />
          </CardHeader>
          <CardBody className="p-0">
            <div className="flex justify-center items-center mt-2">
              <Typography color="emerald" className="font-bold text-lg text-center truncate">
                {product.item_name}
              </Typography>
            </div>
            <Typography
              color="emerald"
              className="font-bold text-lg flex items-center justify-center text-emerald-700"
            >
              Price: Rs.{product.item_price}
            </Typography>
            <div className="flex justify-center items-center mt-2 gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDecrease(product._id);
                }}
                className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-lg font-bold shadow hover:bg-emerald-200"
                disabled={(quantities[product._id] || 1) <= 1}
              >
                -
              </Button>
              <span className="mx-6 text-lg font-semibold">
                {quantities[product._id] || 1}
              </span>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncrease(product._id);
                }}
                className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-lg font-bold shadow hover:bg-emerald-200"
                disabled={(quantities[product._id] || 1) >= product.item_quantity}
              >
                +
              </Button>
            </div>
          </CardBody>
          <CardFooter className="pt-4 pb-4 flex gap-4 px-6">
            <Button
              ripple={false}
              fullWidth={true}
              className="bg-gradient-to-r from-emerald-700 to-emerald-500 py-2 rounded-xl text-white shadow-md hover:from-green-400 hover:to-green-600 hover:text-black transition"
              onClick={async (e) => {
                e.stopPropagation();
                await handleBuyNow(product._id);
              }}
              disabled={isAddingToCart}
            >
              <ShoppingBagOutlined className="mr-2" />
              Buy Now
            </Button>
            <Button
              ripple={false}
              fullWidth={true}
              className="bg-gradient-to-r from-emerald-900 to-emerald-700 p-2 rounded-xl text-white shadow-md hover:from-green-600 hover:to-green-700 hover:text-black transition"
              onClick={async (e) => {
                e.stopPropagation();
                await handleAddToCart(product._id);
              }}
              disabled={isAddingToCart}
            >
              <AddShoppingCartOutlined className="mr-1" />
              Add
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
    <center className="mb-8">
      <button className="bg-emerald-100 text-emerald-700 font-semibold px-8 py-2 rounded-lg shadow-md hover:bg-emerald-200 transition-colors duration-200">
        <a href="/womenbags">View More Bags</a>
      </button>
    </center>
    {/* Product Modal */}
    {selectedProduct && (
      <Dialog open={openModal} handler={handleCloseModal} className="max-w-lg" backdropClassName="bg-transparent">
        <DialogHeader className="flex justify-between items-center">
          <Typography variant="h5" color="emerald" className="text-emerald-700">
            {selectedProduct.item_name}
          </Typography>
          <IconButton
            variant="text"
            onClick={async () => await handleToggleWishlist(selectedProduct._id)}
            className="p-2"
          >
            {wishlist?.some((item) => item.productId === selectedProduct._id) ? (
              <HeartFilled className="h-6 w-6 text-red-500" />
            ) : (
              <HeartOutline className="h-6 w-6 text-emerald-400" />
            )}
          </IconButton>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <img
            src={`https://localhost:3000/uploads/${selectedProduct.image}`}
            alt={selectedProduct.item_name}
            className="w-full h-64 object-contain rounded-xl bg-emerald-50 border"
          />
          <Typography color="emerald" className="font-bold text-lg text-emerald-700">
            Price: Rs.{selectedProduct.item_price}
          </Typography>
          <Typography color="emerald" className="text-md text-emerald-700">
            Available Quantity: {selectedProduct.item_quantity || "N/A"}
          </Typography>
          <Typography color="blue-gray">
            Description: {selectedProduct.description || "No description available"}
          </Typography>
          <div className="flex items-center gap-4">
            <Typography color="emerald" className="font-semibold">
              Quantity:
            </Typography>
            <Button
              onClick={() => handleDecrease(selectedProduct._id)}
              className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-lg font-bold shadow hover:bg-emerald-200"
              disabled={(quantities[selectedProduct._id] || 1) <= 1}
            >
              -
            </Button>
            <span className="text-lg font-semibold">
              {quantities[selectedProduct._id] || 1}
            </span>
            <Button
              onClick={() => handleIncrease(selectedProduct._id)}
              className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-lg font-bold shadow hover:bg-emerald-200"
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
            className="rounded-xl"
          >
            Close
          </Button>
          <Button
            className="bg-gradient-to-r from-emerald-900 to-emerald-700 rounded-xl text-white hover:from-green-600 hover:to-green-700 hover:text-black"
            onClick={async () => await handleAddToCart(selectedProduct._id)}
            disabled={isAddingToCart}
          >
            <AddShoppingCartOutlined className="mr-2" />
            Add to Cart
          </Button>
          <Button
            className="bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-xl text-white hover:from-green-400 hover:to-green-600 hover:text-black"
            onClick={async () => await handleBuyNow(selectedProduct._id)}
            disabled={isAddingToCart}
          >
            <ShoppingBagOutlined className="mr-2" />
            Buy Now
          </Button>
        </DialogFooter>
      </Dialog>
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
  </>
);
};

export default BabyCare;
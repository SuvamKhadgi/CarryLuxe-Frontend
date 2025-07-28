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
  useGetMenCareProducts,
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

export const MenCare = () => {
  const { data, isLoading, isError } = useGetMenCareProducts();
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
      <div className="pt-32 bg-gray-200 h-full overflow-auto">
        <div className="flex items-center justify-center mb-8 ">
          <div className="border-t border-gray-400 w-24"></div>
          <Typography className="mx-14 text-2xl font-semibold">Men Bags</Typography>
          <div className="border-t border-gray-400 w-24"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-6 py-4">
          {data?.map((product) => (
            <Card
              key={product._id}
              className="w-full max-w-3xs mx-auto shadow-lg rounded-4xl overflow-hidden cursor-pointer"
              onClick={() => handleOpenModal(product)}
            >
              <CardHeader shadow={false} floated={false} className="h-40">
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
                      <HeartOutline className="h-6 w-6 text-gray-500" />
                    )}
                  </IconButton>
                </div>
                <img
                  src={`https://localhost:3000/uploads/${product.image}`}
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
              <CardFooter className="pt-4 pb-4 flex  px-11 ">
                <Button
                  ripple={false}
                  fullWidth={true}
                  className="bg-[#D72638] py-0  rounded-r text-white shadow-md hover:scale-105 transition-transform duration-200  hover:bg-green-300 hover:text-black"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await handleBuyNow(product._id);
                  }}
                  disabled={isAddingToCart}
                ><ShoppingBagOutlined />
                  Buy Now
                </Button>
                <Button
                  ripple={false}
                  fullWidth={true}
                  className="bg-[#333333] flex-1/12 p-2 rounded-l text-white shadow-md hover:scale-105 transition-transform duration-200"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await handleAddToCart(product._id);
                  }}
                  disabled={isAddingToCart}
                ><AddShoppingCartOutlined />

                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {selectedProduct && (

          <Dialog open={openModal} handler={handleCloseModal} className="max-w-lg " backdropClassName="bg-transparent ">
            <DialogHeader className="flex justify-between items-center ">
              <Typography variant="h5" color="blue-gray">
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
                className="bg-black rounded-2xl text-white  hover:bg-green-300 hover:text-black"
                onClick={async () => await handleAddToCart(selectedProduct._id)}
                disabled={isAddingToCart}
              >
                <AddShoppingCartOutlined />
                Add to Cart
              </Button>
              <Button
                className="bg-[#D72638] rounded-2xl text-white   hover:bg-green-300 hover:text-black"
                onClick={async () => await handleBuyNow(selectedProduct._id)}
                disabled={isAddingToCart}
              >
                <ShoppingBagOutlined />
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
export const Mencare = () => {
  const { data, isLoading, isError } = useGetMenCareProducts();
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
      <div className="flex items-center justify-center py-8">
        <div className="border-t border-gray-900 w-24"></div>
        <Typography className="mx-14 text-2xl font-semibold">Men Bags</Typography>
        <div className="border-t border-gray-900 w-24"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-6 py-4">
        {featuredProducts.map((product) => (
          <Card
            key={product._id}
            className="w-full max-w-3xs mx-auto shadow-lg rounded-4xl overflow-hidden cursor-pointer"
            onClick={() => handleOpenModal(product)}
          >
            <CardHeader shadow={false} floated={false} className="h-40">
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
                    <HeartOutline className="h-6 w-6 text-gray-500" />
                  )}
                </IconButton>
              </div>
              <img
                src={`https://localhost:3000/uploads/${product.image}`}
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
            <CardFooter className="pt-4 pb-4 flex px-11 ">
              <Button
                ripple={false}
                fullWidth={true}
                className="bg-[#D72638] py-0  rounded-r text-white shadow-md hover:scale-105 transition-transform duration-200  hover:bg-green-300 hover:text-black"
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleBuyNow(product._id);
                }}
                disabled={isAddingToCart}
              ><ShoppingBagOutlined />
                Buy Now
              </Button>
              <Button
                ripple={false}
                fullWidth={true}
                className="bg-[#333333] flex-1/12 p-2 rounded-l text-white shadow-md hover:scale-105 transition-transform duration-200"
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleAddToCart(product._id);
                }}
                disabled={isAddingToCart}
              ><AddShoppingCartOutlined />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <center className="mb-4">
        <button className="bg-gray-200 text-black font-semibold px-8 py-2 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200">
          <a href="/menbags">View More Bags</a>
        </button>
      </center>
      {selectedProduct && (
        <Dialog open={openModal} handler={handleCloseModal} className="max-w-lg " backdropClassName="bg-transparent ">
          <DialogHeader className="flex justify-between items-center ">
            <Typography variant="h5" color="blue-gray">
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
              className="bg-black rounded-2xl text-white  hover:bg-green-300 hover:text-black"
              onClick={async () => await handleAddToCart(selectedProduct._id)}
              disabled={isAddingToCart}
            >
              <AddShoppingCartOutlined />
              Add to Cart
            </Button>
            <Button
              className="bg-[#D72638] rounded-2xl text-white   hover:bg-green-300 hover:text-black"
              onClick={async () => await handleBuyNow(selectedProduct._id)}
              disabled={isAddingToCart}
            >
              <ShoppingBagOutlined />
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

export default MenCare;
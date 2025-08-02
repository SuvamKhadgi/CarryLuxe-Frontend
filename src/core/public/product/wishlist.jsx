import { HeartIcon as HeartFilled } from "@heroicons/react/24/solid";
import {
  Button, Card, CardBody, CardFooter, CardHeader, Dialog, DialogBody,
  DialogFooter, DialogHeader, IconButton, Typography,
} from "@material-tailwind/react";
import { AddShoppingCartOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import DOMPurify from 'dompurify';
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/footer";
import Navbar from "../../../components/navbar";
import {
  useCartprod,
  useGetWishlist,
  useRemoveFromWishlist,
} from "./productquery";

const Wishlist = () => {
  const { data: wishlist, isLoading, isError } = useGetWishlist();
  const { mutate: addToCart, isLoading: isAddingToCart } = useCartprod();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const [quantities, setQuantities] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const handleIncrease = (itemId) => {
    const item = wishlist?.find((item) => item.productId === itemId)?.product;
    if (item && item.item_quantity) {
      setQuantities((prev) => {
        const currentQuantity = prev[itemId] || 1;
        if (currentQuantity < item.item_quantity) {
          return { ...prev, [itemId]: currentQuantity + 1 };
        }
        toast.error(`Maximum quantity available is ${item.item_quantity}`);
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
      toast.error("Quantity cannot be less than 1");
      return prev;
    });
  };

  const handleAddToCart = (itemId) => {
    const quantity = quantities[itemId] || 1;
    addToCart(
      { itemId, quantity },
      {
        onSuccess: () => toast.success("Item added to cart"),
        onError: (error) => toast.error(error.message || "Failed to add to cart"),
      }
    );
  };

  const handleBuyNow = (itemId) => {
    const quantity = quantities[itemId] || 1;
    addToCart(
      { itemId, quantity },
      {
        onSuccess: () => {
          toast.success("Item added to cart");
          navigate("/mycart");
        },
        onError: (error) => toast.error(error.message || "Failed to add to cart"),
      }
    );
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist({ productId });
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove from wishlist");
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



  if (isError) {
    return (
      toast.error("Please login first"),
     navigate("/login")
    );
  }
return (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
    <Navbar />
    <div className="pt-32 pb-10 px-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10 px-2">
          <h1 className="text-4xl font-extrabold text-emerald-700 tracking-tight drop-shadow text-left">
            My Wishlist
          </h1>
          <span className="text-md text-emerald-700 font-semibold bg-emerald-50 px-4 py-1 rounded-full shadow-sm">
            {(wishlist || []).length} items
          </span>
        </div>
        {(wishlist || []).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <img
              src="https://cdn.dribbble.com/users/1814367/screenshots/4542176/media/aa4aebef8f63b8d3d23a8e43a1b202a9.png"
              className="w-60 h-60 object-contain opacity-90"
              alt="Empty Wishlist"
            />
            <h2 className="mt-4 text-xl text-emerald-700 font-bold">Your wishlist is empty!</h2>
            <p className="text-emerald-400 text-sm mt-2">Start adding items you like to your wishlist.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2 md:px-6 py-4">
            {(wishlist || []).map((item) => (
              <div
                key={item.productId}
                className="relative group bg-white rounded-3xl shadow-2xl hover:shadow-emerald-200 transition-all duration-300 cursor-pointer border border-emerald-100 hover:-translate-y-2"
                onClick={() => handleOpenModal(item.product)}
              >
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWishlist(item.productId);
                  }}
                  className="absolute top-3 right-3 z-20 bg-white border border-red-100 shadow hover:bg-red-100 hover:scale-110 p-2 rounded-full transition"
                >
                  <HeartFilled className="h-6 w-6 text-red-500" />
                </button>
                {/* Image */}
                <div className="h-48 flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-emerald-50 rounded-t-3xl overflow-hidden relative">
                  <img
                    src={`https://localhost:3000/uploads/${DOMPurify.sanitize(item.product.image)}`}
                    alt={DOMPurify.sanitize(item.product.item_name)}
                    className="h-36 w-auto max-w-[85%] object-contain drop-shadow-lg transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {/* Info */}
                <div className="p-5">
                  <h3
                    className="font-bold text-lg text-gray-800 text-center truncate"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.product.item_name) }}
                  />
                  <p className="text-center mt-2 text-emerald-700 font-semibold text-xl">
                    Rs.{item.product.item_price}
                  </p>
                  <div className="flex justify-center items-center mt-3 gap-2">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDecrease(item.productId);
                      }}
                      className="rounded-full bg-emerald-100 text-emerald-800 w-8 h-8 font-bold text-lg shadow hover:bg-emerald-200"
                      disabled={(quantities[item.productId] || 1) <= 1}
                    >-</button>
                    <span className="text-lg font-semibold">{quantities[item.productId] || 1}</span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleIncrease(item.productId);
                      }}
                      className="rounded-full bg-emerald-100 text-emerald-800 w-8 h-8 font-bold text-lg shadow hover:bg-emerald-200"
                      disabled={(quantities[item.productId] || 1) >= item.product.item_quantity}
                    >+</button>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-2 px-5 pb-5">
                  <button
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-500 text-white font-semibold shadow hover:shadow-lg hover:from-green-400 hover:to-green-600 hover:text-black transition"
                    onClick={e => {
                      e.stopPropagation();
                      handleBuyNow(item.productId);
                    }}
                    disabled={isAddingToCart}
                  >
                    <ShoppingBagOutlined className="inline mr-2" />
                    Buy Now
                  </button>
                  <button
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-700 text-white font-semibold shadow hover:shadow-lg hover:from-green-400 hover:to-green-600 hover:text-black transition"
                    onClick={e => {
                      e.stopPropagation();
                      handleAddToCart(item.productId);
                    }}
                    disabled={isAddingToCart}
                  >
                    <AddShoppingCartOutlined className="inline" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Product Modal */}
        {selectedProduct && (
          <Dialog
            open={openModal}
            handler={handleCloseModal}
            className="max-w-lg"
            backdropClassName="bg-white/60 backdrop-blur-md"
          >
            <DialogHeader className="flex justify-between items-center px-6 pt-6 pb-2">
              <Typography
                variant="h5"
                color="blue-gray"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedProduct.item_name) }}
              />
            </DialogHeader>
            <DialogBody className="flex flex-col gap-5 px-6">
              <img
                src={`https://localhost:3000/uploads/${DOMPurify.sanitize(selectedProduct.image)}`}
                alt={DOMPurify.sanitize(selectedProduct.item_name)}
                className="w-full h-64 object-contain rounded-2xl bg-emerald-50 border"
                loading="lazy"
              />
              <Typography color="emerald" className="font-bold text-lg">
                Price: <span className="text-emerald-700">Rs.{selectedProduct.item_price}</span>
              </Typography>
              <Typography color="emerald" className="text-md">
                Available Quantity: <span className="font-semibold">{selectedProduct.item_quantity || "N/A"}</span>
              </Typography>
              <Typography
                color="blue-gray"
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedProduct.description || "No description available") }}
              />
              <div className="flex items-center gap-4">
                <Typography color="emerald" className="font-semibold">
                  Quantity:
                </Typography>
                <button
                  onClick={() => handleDecrease(selectedProduct._id)}
                  className="rounded-full bg-emerald-100 text-emerald-800 w-8 h-8 font-bold text-lg shadow hover:bg-emerald-200"
                  disabled={(quantities[selectedProduct._id] || 1) <= 1}
                >-</button>
                <span className="text-lg font-semibold">
                  {quantities[selectedProduct._id] || 1}
                </span>
                <button
                  onClick={() => handleIncrease(selectedProduct._id)}
                  className="rounded-full bg-emerald-100 text-emerald-800 w-8 h-8 font-bold text-lg shadow hover:bg-emerald-200"
                  disabled={(quantities[selectedProduct._id] || 1) >= selectedProduct.item_quantity}
                >+</button>
              </div>
            </DialogBody>
            <DialogFooter className="flex gap-3 px-6 pb-6">
              <Button
                variant="outlined"
                color="red"
                onClick={handleCloseModal}
                className="rounded-xl"
              >
                Close
              </Button>
              <Button
                className="bg-gradient-to-r from-emerald-900 to-emerald-700 rounded-xl text-white hover:bg-green-400 hover:text-black"
                onClick={() => handleAddToCart(selectedProduct._id)}
                disabled={isAddingToCart}
              >
                <AddShoppingCartOutlined className="inline mr-2" />
                Add to Cart
              </Button>
              <Button
                className="bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-xl text-white hover:bg-green-400 hover:text-black"
                onClick={() => handleBuyNow(selectedProduct._id)}
                disabled={isAddingToCart}
              >
                <ShoppingBagOutlined className="inline mr-2" />
                Buy Now
              </Button>
            </DialogFooter>
          </Dialog>
        )}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,
            style: {
              marginTop: '8rem',
              marginRight: '1rem',
            },
          }}
        />
      </div>
    </div>
    <Footer />
  </div>
);
}
export default Wishlist;
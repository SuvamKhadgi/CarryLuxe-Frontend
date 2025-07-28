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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="pt-32 pb-8 px-4">
        <Typography className="text-2xl font-semibold mb-8 text-center">Wishlist</Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-4">
          {wishlist?.map((item) => (
            <Card
              key={item.productId}
              className="w-full max-w-xs mx-auto shadow-lg rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => handleOpenModal(item.product)}
            >
              <CardHeader shadow={false} floated={false} className="h-40">
                <div className="flex justify-end">
                  <IconButton
                    variant="text"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(item.productId);
                    }}
                    className="p-2"
                  >
                    <HeartFilled className="h-6 w-6 text-red-500" />
                  </IconButton>
                </div>
                <img
                  src={`https://localhost:3000/uploads/${DOMPurify.sanitize(item.product.image)}`}
                  alt={DOMPurify.sanitize(item.product.item_name)}
                  className="max-h-30 w-full object-contain"
                  loading="lazy"
                />
              </CardHeader>
              <CardBody className="p-4">
                <Typography
                  color="blue-gray"
                  className="font-bold text-lg text-center truncate"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.product.item_name) }}
                />
                <Typography
                  color="blue-gray"
                  className="font-bold text-lg text-center"
                >
                  Price: Rs.{item.product.item_price}
                </Typography>
                <div className="flex justify-center items-center mt-2 gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecrease(item.productId);
                    }}
                    className="bg-gray-300 px-3 py-1 text-lg font-bold text-black"
                    disabled={(quantities[item.productId] || 1) <= 1}
                  >
                    -
                  </Button>
                  <span className="text-lg font-semibold">
                    {quantities[item.productId] || 1}
                  </span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIncrease(item.productId);
                    }}
                    className="bg-gray-300 px-3 py-1 text-lg font-bold text-black"
                    disabled={(quantities[item.productId] || 1) >= item.product.item_quantity}
                  >
                    +
                  </Button>
                </div>
              </CardBody>
              <CardFooter className="pt-4 pb-4 flex gap-2 px-4">
                <Button
                  ripple={false}
                  className="bg-[#D72638] flex-1 py-2 rounded-lg text-white shadow-md hover:bg-green-300 hover:text-black transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(item.productId);
                  }}
                  disabled={isAddingToCart}
                >
                  <ShoppingBagOutlined className="inline mr-2" />
                  Buy Now
                </Button>
                <Button
                  ripple={false}
                  className="bg-[#333333] flex-1 py-2 rounded-lg text-white shadow-md hover:bg-green-300 hover:text-black transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item.productId);
                  }}
                  disabled={isAddingToCart}
                >
                  <AddShoppingCartOutlined className="inline" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {selectedProduct && (
          <Dialog
            open={openModal}
            handler={handleCloseModal}
            className="max-w-lg"
            backdropClassName="bg-white/50 backdrop-blur-sm"
          >
            <DialogHeader className="flex justify-between items-center">
              <Typography
                variant="h5"
                color="blue-gray"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedProduct.item_name) }}
              />
            </DialogHeader>
            <DialogBody className="flex flex-col gap-4">
              <img
                src={`https://localhost:3000/uploads/${DOMPurify.sanitize(selectedProduct.image)}`}
                alt={DOMPurify.sanitize(selectedProduct.item_name)}
                className="w-full h-64 object-contain rounded-lg"
                loading="lazy"
              />
              <Typography color="blue-gray" className="font-bold">
                Price: Rs.{selectedProduct.item_price}
              </Typography>
              <Typography color="blue-gray">
                Available Quantity: {selectedProduct.item_quantity || "N/A"}
              </Typography>
              <Typography
                color="blue-gray"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedProduct.description || "No description available") }}
              />
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
                  className="bg-gray-300 px-3 py-1 text-lg font-bold text-black"
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
                className="rounded-lg"
              >
                Close
              </Button>
              <Button
                className="bg-black rounded-lg text-white hover:bg-green-300 hover:text-black"
                onClick={() => handleAddToCart(selectedProduct._id)}
                disabled={isAddingToCart}
              >
                <AddShoppingCartOutlined className="inline mr-2" />
                Add to Cart
              </Button>
              <Button
                className="bg-[#D72638] rounded-lg text-white hover:bg-green-300 hover:text-black"
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
      <Footer />
    </div>
  );
};

export default Wishlist;
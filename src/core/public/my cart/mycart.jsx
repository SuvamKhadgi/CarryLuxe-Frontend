import axios from "axios";
import { Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../../components/footer";
import Navbar from "../../../components/navbar";
import { useAddToWishlist } from "../product/productquery";

const OrderCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cartId, setCartId] = useState("");
  const navigate = useNavigate();
  const { mutate: addToWishlist } = useAddToWishlist();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("https://localhost:3000/api/creds/me", {
          withCredentials: true,
        });
        setUserId(response.data.id);
        fetchData(response.data.id);
      } catch (error) {
        toast.error("Please log in first.");
        navigate("/login", { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchData = async (userId) => {
    try {
      const response = await axios.get(
        `https://localhost:3000/api/cart/user/${userId}`,
        { withCredentials: true }
      );
      if (response.data.length > 0) {
        setCartId(response.data[0]._id);
        setCartItems(response.data[0].items || []);
      }
    } catch (error) {
      setCartItems([]);
    //   toast.error("Failed to fetch cart dataa");
    }
  };

  const handleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => {
      if (selectedItems.includes(item.itemId._id)) {
        return total + (item.quantity || 0) * (item.itemId?.item_price || 0);
      }
      return total;
    }, 0);
  };

  const handleDelete = async (cartId, itemId) => {
    try {
      await axios.delete(`https://localhost:3000/api/cart/${cartId}/item/${itemId}`, {
        withCredentials: true,
      });
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => item.itemId._id !== itemId)
      );
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(
        `https://localhost:3000/api/cart/${cartId}/item/${itemId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.itemId._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success("Quantity updated successfully");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleAddToWishlist = (productId) => {
    if (!userId) {
      toast.error("Please log in first.");
      return;
    }
    addToWishlist(
      { productId, userId },
      {
        onSuccess: () => toast.success("Added to wishlist"),
        onError: () => toast.error("Failed to add to wishlist"),
      }
    );
  };

  const validateForm = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to order");
      return false;
    }
    if (!address.trim()) {
      toast.error("Delivery Address is required");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Phone Number is required");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone Number must be exactly 10 digits");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    toast.loading("Redirecting to eSewa for payment...", { theme: "colored" });

    try {
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }
      if (!cartId) {
        toast.error("Cart ID not found!");
        return;
      }

      const selectedCartItems = cartItems
        .filter((item) => selectedItems.includes(item.itemId._id))
        .map((item) => ({
          itemId: item.itemId._id,
          quantity: item.quantity,
          item_name: item.itemId.item_name,
          item_price: item.itemId.item_price,
        }));

      const totalAmount = calculateTotalAmount(cartItems);

      const orderResponse = await axios.post(
        `https://localhost:3000/api/order/`,
        {
          userId,
          address,
          phone_no: phone,
          items: selectedCartItems,
          total_amount: totalAmount,
        },
        { withCredentials: true }
      );

      const orderId = orderResponse.data._id;
      const url = `https://localhost:3000/api/order/create/${orderId}`;

      const paymentData = {
        amount: totalAmount,
        payment_method: "test",
      };

      const paymentResponse = await axios.post(url, paymentData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      esewaCall(paymentResponse.data.formData);
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => !selectedItems.includes(item.itemId._id))
      );
      setSelectedItems([]);
      setShowModal(false);
      setAddress("");
      setPhone("");
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhone(value);
    }
  };

  const esewaCall = (formData) => {
    const path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = path;

    for (const key in formData) {
      const hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.value = formData[key];
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <>
      <div className=""><Navbar /></div>
      <div className="container mx-auto p-4">
        <div className="bg-white mt-20 shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-6">My Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.itemId._id)}
                          onChange={() => handleItemSelection(item.itemId._id)}
                          className="h-5 w-5 text-blue-600"
                        />
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                            {item.itemId?.image ? (
                              <img
                                src={`https://localhost:3000/uploads/${item.itemId.image}`}
                                alt={item.itemId?.item_name || "Product"}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {item.itemId?.item_name || "N/A"}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Bag ID: {item._id.slice(-8)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAddToWishlist(item.itemId._id)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                              </button>
                              <button
                                onClick={() => handleDelete(cartId, item.itemId._id)}
                                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                              >
                                <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            <p className="font-medium">Bag Name: {item.itemId?.item_name || "N/A"}</p>
                            <p className="mt-1">Bag Description: {item.itemId?.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">Bag Quantity:</span>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                  <button
                                    onClick={() => handleQuantityChange(item.itemId._id, item.quantity - 1)}
                                    className="p-1 hover:bg-gray-100 rounded-l-md"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="px-3 py-1 bg-gray-50 text-sm font-medium">
                                    {item.quantity || 0}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(item.itemId._id, item.quantity + 1)}
                                    className="p-1 hover:bg-gray-100 rounded-r-md"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium text-gray-600">Bag Price:</span>
                                <span className="ml-2 font-semibold text-gray-900">
                                  Rs.{item.itemId?.item_price || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600">Add some items to your cart to get started!</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-2xl font-bold text-center mb-6">Order Summary</h2>
              {cartItems.length > 0 && (
                <>
                  <div className="space-y-3 mb-6">
                    {cartItems
                      .filter((item) => selectedItems.includes(item.itemId._id))
                      .map((item) => (
                        <div key={item._id} className="flex justify-between items-center text-sm">
                          <div className="flex-1">
                            <p className="font-medium truncate">{item.itemId?.item_name || "N/A"}</p>
                            <p className="text-gray-600">Qty: {item.quantity || 0} × Rs.{item.itemId?.item_price || 0}</p>
                          </div>
                          <div className="font-medium">
                            ${item.quantity * item.itemId.item_price}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Amount:</span>
                      <span>Rs.{calculateTotalAmount(cartItems)}</span>
                    </div>
                  </div>
                  <button
                    className="w-full mt-6 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                    onClick={() => setShowModal(true)}
                    disabled={selectedItems.length === 0}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Place Order Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={2500} style={{ top: "8rem" }} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="colored" />
        {showModal && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Complete Your Order</h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full address"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    required
                    onChange={handlePhoneChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Amount:</span>
                    <span>Rs.{calculateTotalAmount(cartItems)}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default OrderCart;
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
      await axios.delete(`https://localhost:3000/api/cart/${cartId}/item/${itemId}`);
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => item.itemId._id !== itemId)
      );
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      toast.success("Item deleted successfully");
    } catch (error) {
      // console.error("Error deleting item:", error);
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(
        `https://localhost:3000/api/cart/${cartId}/item/${itemId}`,
        { quantity: newQuantity }
      );
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.itemId._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success("Quantity updated successfully");
    } catch (error) {
      // console.error("Error updating quantity:", error);
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
        }
      );

      const orderId = orderResponse.data._id;
      const url = `https://localhost:3000/api/order/create/${orderId}`;

      const paymentData = {
        amount: totalAmount,
        payment_method: "test",
      };

      const paymentResponse = await axios.post(url, paymentData, {
        headers: { "Content-Type": "application/json" }
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
      // console.error("Error placing order:", error.response?.data || error);
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
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 py-10">
      <div className="max-w-7xl mx-auto p-2">
        <div className="bg-white mt-20 shadow-xl rounded-3xl p-8">
          <h1 className="text-4xl font-extrabold text-center text-emerald-700 mb-10 tracking-tight drop-shadow">
            My Cart
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cartItems && cartItems.length > 0 ? (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100 border border-emerald-100 rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex items-center gap-5">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.itemId._id)}
                          onChange={() => handleItemSelection(item.itemId._id)}
                          className="h-5 w-5 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-400"
                        />
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                            {item.itemId?.image ? (
                              <img
                                src={`https://localhost:3000/uploads/${item.itemId.image}`}
                                alt={item.itemId?.item_name || "Product"}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-emerald-400" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-emerald-800 text-lg">
                                {item.itemId?.item_name || "N/A"}
                              </h3>
                              <p className="text-xs text-emerald-400 mt-1">
                                Bag ID: {item._id.slice(-8)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAddToWishlist(item.itemId._id)}
                                className="p-1 hover:bg-emerald-50 rounded-full transition"
                              >
                                <Heart className="w-5 h-5 text-emerald-400 hover:text-red-500" />
                              </button>
                              <button
                                onClick={() => handleDelete(cartId, item.itemId._id)}
                                className="p-1 hover:bg-red-100 rounded-full transition"
                              >
                                <Trash2 className="w-5 h-5 text-emerald-400 hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                          <div className="text-xs text-emerald-500 mb-2">
                            <p className="font-medium">Bag Name: {item.itemId?.item_name || "N/A"}</p>
                            <p className="mt-1">Bag Description: {item.itemId?.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</p>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-emerald-700">Bag Quantity:</span>
                                <div className="flex items-center border border-emerald-200 rounded-md bg-emerald-50">
                                  <button
                                    onClick={() => handleQuantityChange(item.itemId._id, item.quantity - 1)}
                                    className="p-1 hover:bg-emerald-100 rounded-l-md"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="px-3 py-1 text-sm font-medium">
                                    {item.quantity || 0}
                                  </span>
                                  <button
                                    onClick={() => handleQuantityChange(item.itemId._id, item.quantity + 1)}
                                    className="p-1 hover:bg-emerald-100 rounded-r-md"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium text-emerald-700">Bag Price:</span>
                                <span className="ml-2 font-bold text-emerald-800">
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
                <div className="text-center py-20">
                  <ShoppingBag className="mx-auto w-16 h-16 text-emerald-300 mb-4" />
                  <h3 className="text-xl font-bold text-emerald-700 mb-2">Your cart is empty</h3>
                  <p className="text-emerald-400">Add some items to your cart to get started!</p>
                </div>
              )}
            </div>
            {/* Order Summary */}
            <div className="bg-emerald-50 p-8 rounded-2xl shadow-lg h-fit border border-emerald-100">
              <h2 className="text-2xl font-bold text-center text-emerald-700 mb-8">Order Summary</h2>
              {cartItems && cartItems.length > 0 && (
                <>
                  <div className="space-y-4 mb-7">
                    {cartItems
                      .filter((item) => selectedItems.includes(item.itemId._id))
                      .map((item) => (
                        <div key={item._id} className="flex justify-between items-center text-sm">
                          <div className="flex-1">
                            <p className="font-semibold truncate text-emerald-800">{item.itemId?.item_name || "N/A"}</p>
                            <p className="text-emerald-400">Qty: {item.quantity || 0} × Rs.{item.itemId?.item_price || 0}</p>
                          </div>
                          <div className="font-bold text-emerald-700">
                            Rs.{item.quantity * item.itemId.item_price}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="border-t border-emerald-200 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Amount:</span>
                      <span>Rs.{calculateTotalAmount(cartItems)}</span>
                    </div>
                  </div>
                  <button
                    className="w-full mt-8 py-3 px-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center gap-2 font-semibold shadow"
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
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl w-11/12 md:w-2/5 max-w-md shadow-xl border border-emerald-100">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold text-emerald-700">Complete Your Order</h2>
                <button
                  className="text-emerald-400 hover:text-emerald-700 text-3xl"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full address"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    required
                    onChange={handlePhoneChange}
                    className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <div className="flex justify-between items-center font-bold text-emerald-700">
                    <span>Total Amount:</span>
                    <span>Rs.{calculateTotalAmount(cartItems)}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-semibold shadow"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer />
  </>
);
}
export default OrderCart;
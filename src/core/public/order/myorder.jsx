import axios from "axios";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../../components/footer";
import Navbar from "../../../components/navbar";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("https://localhost:3000/api/creds/me", {
          withCredentials: true,
        });
        setUserId(response.data.id);
        fetchOrders(response.data.id);
      } catch (error) {
        toast.error("Please log in first.");
        navigate("/login", { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchOrders = async (userId) => {
    try {
      const response = await axios.get(`https://localhost:3000/api/order/user/${userId}`, {
        withCredentials: true,
      });
      setOrders(response.data || []);
    } catch (error) {
      // toast.error(error.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.delete(`https://localhost:3000/api/order/${orderId}`, {
        withCredentials: true,
      });
      setOrders(orders.filter((order) => order._id !== orderId));
      toast.success("Order canceled successfully");
    } catch (error) {
      // console.error("Error canceling order:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <>
      <div className=""><Navbar /></div>
      <div className="container mx-auto p-4">
        <div className="bg-white mt-20 shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-6">My Orders</h1>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="p-4 font-semibold text-sm uppercase">Order ID</th>
                    <th className="p-4 font-semibold text-sm uppercase">Items</th>
                    <th className="p-4 font-semibold text-sm uppercase">Address</th>
                    <th className="p-4 font-semibold text-sm uppercase">Phone No</th>
                    <th className="p-4 font-semibold text-sm uppercase">Total Amount</th>
                    <th className="p-4 font-semibold text-sm uppercase">Status</th>
                    <th className="p-4 font-semibold text-sm uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 break-all text-gray-600">{order._id}</td>
                      <td
                        className="p-4 text-blue-600 break-all cursor-pointer hover:underline"
                        onClick={() => showOrderDetails(order)}
                      >
                        View Items
                      </td>
                      <td className="p-4 text-gray-600">{order.address || "N/A"}</td>
                      <td className="p-4 text-gray-600">{order.phone_no || "N/A"}</td>
                      <td className="p-4 text-gray-600">Rs.${order.total_amount || "N/A"}</td>
                      <td className="p-4 text-gray-600">{order.status || "Pending"}</td>
                      <td className="p-4">
                        <button
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => handleCancelOrder(order._id)}
                          title="Cancel Order"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No orders found
            </div>
          )}
          {showModal && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Order Items (ID: ${selectedOrder._id})
                  </h3>
                  <button
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="p-3 font-semibold text-sm">Item Name</th>
                        <th className="p-3 font-semibold text-sm">Quantity</th>
                        <th className="p-3 font-semibold text-sm">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item._id || item.itemId} className="border-b">
                          <td className="p-3 text-gray-600">
                            {item.item_name || "N/A"}
                          </td>
                          <td className="p-3 text-gray-600">{item.quantity || 0}</td>
                          <td className="p-3 text-gray-600">${item.item_price || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-gray-500 py-4">No items in this order</p>
                )}
              </div>
            </div>
          )}
          <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar={false}
            closeOnClick={true}
            pauseOnHover={true}
            draggable
            theme="colored"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyOrders;
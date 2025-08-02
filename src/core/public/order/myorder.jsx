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
      // Using axios directly to leverage the interceptor for CSRF token
      await axios.delete(`https://localhost:3000/api/order/${orderId}`);
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
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 py-10">
      <div className="max-w-7xl mx-auto p-2">
        <div className="bg-white mt-20 shadow-xl rounded-3xl p-8">
          <h1 className="text-4xl font-extrabold text-center text-emerald-700 mb-10 tracking-tight drop-shadow">
            My Orders
          </h1>
          {(orders || []).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-emerald-50 text-emerald-700 text-sm uppercase">
                    <th className="p-4 font-bold">Order ID</th>
                    <th className="p-4 font-bold">Items</th>
                    <th className="p-4 font-bold">Address</th>
                    <th className="p-4 font-bold">Phone No</th>
                    <th className="p-4 font-bold">Total Amount</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(orders || []).map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-emerald-100 hover:bg-emerald-50/70 transition-colors"
                    >
                      <td className="p-4 break-all text-emerald-700 font-semibold">{order._id}</td>
                      <td
                        className="p-4 text-emerald-600 underline break-all cursor-pointer font-semibold"
                        onClick={() => showOrderDetails(order)}
                      >
                        View Items
                      </td>
                      <td className="p-4 text-emerald-700">{order.address || "N/A"}</td>
                      <td className="p-4 text-emerald-700">{order.phone_no || "N/A"}</td>
                      <td className="p-4 text-emerald-700 font-bold">Rs.{order.total_amount || "N/A"}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {order.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          className="p-2 text-red-500 hover:text-red-700 transition"
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
            <div className="text-center py-20">
              <img
                src="https://cdn.dribbble.com/users/1814367/screenshots/4542176/media/aa4aebef8f63b8d3d23a8e43a1b202a9.png"
                className="mx-auto w-40 h-40 opacity-90"
                alt="No Orders"
              />
              <h3 className="text-xl font-bold text-emerald-700 mt-6 mb-2">No orders found</h3>
              <p className="text-emerald-400">Order something to see it here!</p>
            </div>
          )}
          {showModal && selectedOrder && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 w-11/12 md:w-2/5 max-w-lg shadow-xl border border-emerald-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-emerald-700">
                    Order Items<br/>
                    <span className="text-xs font-medium text-emerald-400">ID: {selectedOrder._id}</span>
                  </h3>
                  <button
                    className="text-emerald-400 hover:text-emerald-700 text-3xl"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <table className="w-full text-left mb-2">
                    <thead>
                      <tr className="bg-emerald-50 text-emerald-700">
                        <th className="p-3 font-semibold text-sm">Item Name</th>
                        <th className="p-3 font-semibold text-sm">Quantity</th>
                        <th className="p-3 font-semibold text-sm">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item._id || item.itemId} className="border-b border-emerald-100">
                          <td className="p-3 text-emerald-700">
                            {item.item_name || "N/A"}
                          </td>
                          <td className="p-3 text-emerald-700">{item.quantity || 0}</td>
                          <td className="p-3 text-emerald-700">Rs.{item.item_price || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-emerald-400 py-4">No items in this order</p>
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
            style={{ top: "8rem" }}
          />
        </div>
      </div>
    </div>
    <Footer />
  </>
);
}
export default MyOrders;
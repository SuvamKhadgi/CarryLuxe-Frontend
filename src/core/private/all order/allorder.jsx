import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Side from '../../../components/sidebar';

function Allorder() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('https://localhost:3000/api/creds/me', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Authentication failed');
        const data = await response.json();
        if (!data.role || data.role !== 'admin') {
          toast.error('Access denied: Admins only');
          navigate('/', { replace: true });
        }
      } catch (error) {
        toast.error('Please log in');
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch all orders
  useEffect(() => {
    if (!loading) fetchData();
  }, [loading]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://localhost:3000/api/order', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setItems(data || []);
    } catch (error) {
      // console.error('Error fetching orders:', error);
      setItems([]);
    }
  };

  // Delete order
  const handleDelete = async (id) => {
    try {
      // Using axios to leverage the interceptor for CSRF token
      await axios.delete(`https://localhost:3000/api/order/${id}`);
      setItems(items.filter((item) => item._id !== id));
      toast.success('Order deleted successfully');
    } catch (error) {
      // console.error('Error deleting order:', error);
      toast.error(error.response?.data?.message || 'Failed to delete order');
    }
  };

  // Show order items in modal
  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
  <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
    {/* Sidebar */}
    <div className="fixed h-full">
      <Side />
    </div>
    {/* Main Content */}
    <div className="flex-1 ml-64 p-8">
      <h2 className="text-4xl font-extrabold text-emerald-700 text-center mb-10 tracking-tight drop-shadow">
        ALL ORDERS
      </h2>
      <div className="w-full bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
        {items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-emerald-50 text-emerald-700 text-sm uppercase">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">User</th>
                  <th className="p-4 font-bold">Items</th>
                  <th className="p-4 font-bold">Address</th>
                  <th className="p-4 font-bold">Phone No</th>
                  <th className="p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-emerald-100 hover:bg-emerald-50/70 transition"
                  >
                    <td className="p-4 text-emerald-700 break-all font-semibold">{item._id}</td>
                    <td className="p-4 text-emerald-700 break-all">{item.userId || "N/A"}</td>
                    <td
                      className="p-4 text-emerald-600 break-all cursor-pointer hover:underline font-semibold"
                      onClick={() => showOrderDetails(item)}
                    >
                      View Items
                    </td>
                    <td className="p-4 text-emerald-700">{item.address || "N/A"}</td>
                    <td className="p-4 text-emerald-700">{item.phone_no || "N/A"}</td>
                    <td className="p-4">
                      <button
                        className="p-2 text-red-500 hover:text-red-700 transition"
                        onClick={() => handleDelete(item._id)}
                        title="Delete Order"
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
            <p className="text-emerald-400">No orders have been placed yet.</p>
          </div>
        )}
      </div>
      {/* Modal for viewing order items */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-xl border border-emerald-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-emerald-700">
                Order Items<br />
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
                      <td className="p-3 text-emerald-700">
                        {item.quantity || 0}
                      </td>
                      <td className="p-3 text-emerald-700">
                        Rs.{item.item_price || "N/A"}
                      </td>
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
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  </div>
);
}
export default Allorder;
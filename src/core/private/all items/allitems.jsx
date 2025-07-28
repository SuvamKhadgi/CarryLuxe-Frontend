import { Clipboard, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Side from '../../../components/sidebar';
import { useDeleteItem, useGetList, useUpdateItem } from './query';
import DOMPurify from 'dompurify';

function Allitems() {
  const navigate = useNavigate();
  const { data: itemsList, isLoading } = useGetList();
  const { mutate: deleteItem } = useDeleteItem();
  const { mutate: updateItem } = useUpdateItem();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    item_price: '',
    item_quantity: '',
    item_type: '',
    sub_item_type: '',
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

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

  // Search logic
  useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(itemsList?.data || []);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`https://localhost:3000/api/items/search?query=${encodeURIComponent(searchQuery)}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setFilteredItems(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setFilteredItems([]);
      }
    };
    fetchSearchResults();
  }, [searchQuery, itemsList]);

  const handleDelete = (id) => {
    deleteItem(id, {
      onSuccess: () => {
        toast.success('Item deleted successfully!');
      },
      onError: (error) => {
        toast.error('Error deleting item');
        console.error("Error deleting item:", error);
      },
    });
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    toast.success('ID copied to clipboard!');
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      item_name: item.item_name || '',
      description: item.description || '',
      item_price: item.item_price || '',
      item_quantity: item.item_quantity || '',
      item_type: item.item_type || '',
      sub_item_type: item.sub_item_type || '',
      image: null,
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const validateForm = () => {
    const { item_name, description, item_price, item_quantity, item_type, sub_item_type } = formData;

    if (!item_name.trim()) {
      toast.error("Item Name is required");
      return false;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!item_price) {
      toast.error("Item Price is required");
      return false;
    }
    if (isNaN(item_price) || Number(item_price) <= 0) {
      toast.error("Item Price must be a positive number");
      return false;
    }
    if (!item_quantity) {
      toast.error("Item Quantity is required");
      return false;
    }
    if (isNaN(item_quantity) || Number(item_quantity) <= 0) {
      toast.error("Item Quantity must be a positive number");
      return false;
    }
    if (!item_type.trim()) {
      toast.error("Item Type is required");
      return false;
    }
    if (!sub_item_type.trim()) {
      toast.error("Sub Item Type is required");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('item_name', DOMPurify.sanitize(formData.item_name));
    formDataToSend.append('description', DOMPurify.sanitize(formData.description));
    formDataToSend.append('item_price', formData.item_price);
    formDataToSend.append('item_quantity', formData.item_quantity);
    formDataToSend.append('item_type', DOMPurify.sanitize(formData.item_type));
    formDataToSend.append('sub_item_type', DOMPurify.sanitize(formData.sub_item_type));
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    updateItem(
      { id: selectedItem._id, data: formDataToSend },
      {
        onSuccess: () => {
          toast.success('Item updated successfully!');
          setShowEditModal(false);
          setFormData({
            item_name: '',
            description: '',
            item_price: '',
            item_quantity: '',
            item_type: '',
            sub_item_type: '',
            image: null,
          });
        },
        onError: (error) => {
          toast.error('Error updating item');
          console.error("Error updating item:", error);
        },
      }
    );
  };

  const totalItems = filteredItems.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading || isLoading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Side />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">All Items</h2>
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 text-blue-800">
                <tr>
                  <th className="p-3 font-semibold text-left">ID</th>
                  <th className="p-3 font-semibold text-left">Name</th>
                  <th className="p-3 font-semibold text-left">Image</th>
                  <th className="p-3 font-semibold text-left">Description</th>
                  <th className="p-3 font-semibold text-left">Category</th>
                  <th className="p-3 font-semibold text-left">Qty</th>
                  <th className="p-3 font-semibold text-left">Price</th>
                  <th className="p-3 font-semibold text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center">
                        <span className="truncate max-w-[100px]">{item._id}</span>
                        <button onClick={() => handleCopy(item._id)} className="ml-2">
                          <Clipboard size={16} className="text-gray-500 hover:text-blue-600" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3 truncate max-w-[150px]">{item.item_name}</td>
                    <td className="p-3">
                      <img
                        src={`https://localhost:3000/uploads/${item.image}`}
                        alt={item.item_name}
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    </td>
                    <td className="p-3 truncate max-w-[200px]">{item.description}</td>
                    <td className="p-3">{item.item_type}</td>
                    <td className="p-3">{item.item_quantity}</td>
                    <td className="p-3">${item.item_price}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                      >
                        <Pencil size={16} className="text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 p-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Item</h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={() => setShowEditModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    name="item_price"
                    value={formData.item_price}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    name="item_quantity"
                    value={formData.item_quantity}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                  <input
                    type="text"
                    name="item_type"
                    value={formData.item_type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Item Type</label>
                  <input
                    type="text"
                    name="sub_item_type"
                    value={formData.sub_item_type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default Allitems;
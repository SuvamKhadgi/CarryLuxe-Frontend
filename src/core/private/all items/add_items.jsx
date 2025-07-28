import { Trash2, Upload, Plus, ShoppingBag, Image as ImageIcon, DollarSign, Package } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Side from '../../../components/sidebar';
import { useSaveItem } from './query';
import DOMPurify from 'dompurify';

function Additems() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const saveApi = useSaveItem();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const subOptions = {
    "luxecarry": ["Hand Bags", "Women Bags", "Men Bags", "Party Bags", "Travel Bags", "Wallets", "Clutches", "Backpacks", "Luggage", "Sports Bags", "Trekking Bags", "Office Bags", "School Bags", "Tote Bags", "Messenger Bags", "Duffel Bags"],
    "Prada": ["Hand Bags", "Women Bags", "Men Bags", "Party Bags", "Travel Bags", "Wallets", "Clutches", "Backpacks", "Luggage", "Sports Bags", "Trekking Bags", "Office Bags", "School Bags", "Tote Bags", "Messenger Bags", "Duffel Bags"],
    "Adidas": ["Hand Bags", "Women Bags", "Men Bags", "Party Bags", "Travel Bags", "Wallets", "Clutches", "Backpacks", "Luggage", "Sports Bags", "Trekking Bags", "Office Bags", "School Bags", "Tote Bags", "Messenger Bags", "Duffel Bags"],
    "Puma": ["Hand Bags", "Women Bags", "Men Bags", "Party Bags", "Travel Bags", "Wallets", "Clutches", "Backpacks", "Luggage", "Sports Bags", "Trekking Bags", "Office Bags", "School Bags", "Tote Bags", "Messenger Bags", "Duffel Bags"],
    "Gucci": ["Hand Bags", "Women Bags", "Men Bags", "Party Bags", "Travel Bags", "Wallets", "Clutches", "Backpacks", "Luggage", "Sports Bags", "Trekking Bags", "Office Bags", "School Bags", "Tote Bags", "Messenger Bags", "Duffel Bags"],
    "Louis Vuitton": ["Hand Bags", "Women Bags", "Men Bags", "Party Bags", "Travel Bags", "Wallets", "Clutches", "Backpacks", "Luggage", "Sports Bags", "Trekking Bags", "Office Bags", "School Bags", "Tote Bags", "Messenger Bags", "Duffel Bags"],
    "Nike": ["Hand Bags", "Women Bags", "Men Bags", "Party Bags", "Travel Bags", "Wallets", "Clutches", "Backpacks", "Luggage", "Sports Bags", "Trekking Bags", "Office Bags", "School Bags", "Tote Bags", "Messenger Bags", "Duffel Bags"],
    "Michael Kors": ["Hand Bags", "Women Bags", "Men Bags", "Party Bags", "Travel Bags", "Wallets", "Clutches", "Backpacks", "Luggage", "Sports Bags", "Trekking Bags", "Office Bags", "School Bags", "Tote Bags", "Messenger Bags", "Duffel Bags"],
    "Coach": ["Hand Bags", "Women Bags", "Men Bags", "Party Bags", "Travel Bags", "Wallets", "Clutches", "Backpacks", "Luggage", "Sports Bags", "Trekking Bags", "Office Bags", "School Bags", "Tote Bags", "Messenger Bags", "Duffel Bags"],
  };

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

  const handleCategoryChange = (event) => {
    const selectedValue = DOMPurify.sanitize(event.target.value);
    setSelectedCategory(selectedValue);
    setValue("item_type", selectedValue);
    setValue("sub_item_type", "");
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!data.item_type || !data.sub_item_type) {
      toast.error("Please select a category and subcategory");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append('item_name', DOMPurify.sanitize(data.item_name));
    formData.append('description', DOMPurify.sanitize(data.description));
    formData.append('item_quantity', parseInt(data.item_quantity));
    formData.append('item_price', parseFloat(data.item_price));
    if (data.image[0]) formData.append('image', data.image[0]);
    formData.append('item_type', DOMPurify.sanitize(data.item_type));
    formData.append('sub_item_type', DOMPurify.sanitize(data.sub_item_type));

    saveApi.mutate(formData, {
      onSuccess: () => {
        toast.success("Product added successfully");
        setValue("item_name", "");
        setValue("description", "");
        setValue("item_quantity", "");
        setValue("item_price", "");
        setValue("image", "");
        setValue("item_type", "");
        setValue("sub_item_type", "");
        setSelectedCategory("");
        setImagePreview(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || "Failed to add product");
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <Side />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Add New Product</h1>
            <p className="text-sm text-gray-600">Create a new bag listing for luxecarry</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  {...register('item_name', { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter item name"
                />
                {errors.item_name && <span className="text-red-500 text-xs">Item name is required</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register('description', { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter description"
                />
                {errors.description && <span className="text-red-500 text-xs">Description is required</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  {...register('item_quantity', { required: true, min: 1 })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter quantity"
                />
                {errors.item_quantity && <span className="text-red-500 text-xs">Quantity is required</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  {...register('item_price', { required: true, min: 1 })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Enter price"
                />
                {errors.item_price && <span className="text-red-500 text-xs">Price is required</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  {...register('item_type', { required: true })}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select Category</option>
                  {Object.keys(subOptions).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.item_type && <span className="text-red-500 text-xs">Category is required</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                <select
                  {...register('sub_item_type', { required: true })}
                  value={watch('sub_item_type')}
                  onChange={(e) => setValue('sub_item_type', DOMPurify.sanitize(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  disabled={!selectedCategory}
                >
                  <option value="">Select Subcategory</option>
                  {selectedCategory &&
                    subOptions[selectedCategory]?.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                </select>
                {errors.sub_item_type && <span className="text-red-500 text-xs">Subcategory is required</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  {...register('image', {
                    required: true,
                    validate: {
                      acceptedFormats: (files) => {
                        if (!files || files.length === 0) return false;
                        const file = files[0];
                        return ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
                      },
                      maxSize: (files) => {
                        if (!files || files.length === 0) return false;
                        const file = files[0];
                        return file.size <= 2 * 1024 * 1024;
                      },
                    },
                  })}
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                {errors.image?.type === "required" && <span className="text-red-500 text-xs">Image is required</span>}
                {errors.image?.type === "acceptedFormats" && <span className="text-red-500 text-xs">Invalid image format</span>}
                {errors.image?.type === "maxSize" && <span className="text-red-500 text-xs">Image must be less than 2MB</span>}
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded" />}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                {isLoading ? "Saving..." : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Additems;
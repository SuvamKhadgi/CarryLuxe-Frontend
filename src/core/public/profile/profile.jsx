import { DeliveryDining } from '@mui/icons-material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../../components/footer";
import Navbar from '../../../components/navbar';

const MyProfile = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    country: '',
    email: '',
    region_state: '',
    address: '',
    profile_picture: ''
  });
  const [originalFormData, setOriginalFormData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cookies = document.cookie;

        const response = await axios.get('https://localhost:3000/api/creds/profile', {
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        // console.log('Profile data received:', response.data);
        const userData = response.data;
        const newFormData = {
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone: userData.phone || '',
          country: userData.country || '',
          email: userData.email || '',
          address: userData.address || '',
          region_state: userData.region_state || '',
          profile_picture: userData.profile_picture || ''
        };
        setFormData(newFormData);
        setOriginalFormData(newFormData);
      } catch (error) {
        // console.error('Error fetching user data:', error);
        const status = error.response?.status;
        const message = error.response?.data?.message || 'Failed to load profile';
        if (status === 401) {
          toast.error('Session expired. Please log in again.');
        } else if (error.code === 'ERR_NETWORK') {
          toast.error('Network error: Unable to connect to the server.');
        } else {
          toast.error(message);
        }
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { first_name, last_name, phone, country, email, region_state, address } = formData;

    if (!first_name.trim()) {
      toast.error("First Name is required");
      return false;
    }
    if (!last_name.trim()) {
      toast.error("Last Name is required");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Phone Number is required");
      return false;
    }
    if (!/^\d{10,15}$/.test(phone)) {
      toast.error("Phone Number must be 10 to 15 digits");
      return false;
    }
    if (!country.trim()) {
      toast.error("Country is required");
      return false;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!region_state.trim()) {
      toast.error("Region/State is required");
      return false;
    }
    if (!address.trim()) {
      toast.error("Address is required");
      return false;
    }
    return true;
  };

  const handleEdit = () => {
    setIsEditable(true);
    // console.log('Edit mode enabled');
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      let newProfilePicture = formData.profile_picture;

      if (selectedFile) {
        // console.log('Uploading file:', selectedFile.name);
        const formDataToUpload = new FormData();
        formDataToUpload.append('profile_picture', selectedFile);
        const uploadResponse = await axios.post('https://localhost:3000/api/creds/uploadImage', formDataToUpload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        // console.log('Image upload response:', uploadResponse.data);
        newProfilePicture = uploadResponse.data.data;
      }

      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) payload.append(key, formData[key]);
      });
      if (newProfilePicture) payload.append('profile_picture', newProfilePicture);

      // console.log('Sending profile update request...');
      const response = await axios.put('https://localhost:3000/api/creds/profile', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // console.log('Profile update response:', response.data);
      setFormData(prev => ({ ...prev, profile_picture: newProfilePicture }));
      setOriginalFormData({ ...formData, profile_picture: newProfilePicture });
      setIsEditable(false);
      setSelectedFile(null);
      setTimeout(() => {
        toast.success('Profile updated successfully!');
      }, 100);

    } catch (error) {
      // console.error('Error saving profile:', error);
      const status = error.response?.status;
      const errorMsg = error.response?.data?.message || 'Update failed';
      if (status === 500) {
        toast.error('Server error during image upload. Please try again.');
      } else if (status === 400) {
        toast.error(errorMsg);
      } else if (status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/login', { replace: true });
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalFormData);
    setSelectedFile(null);
    setIsEditable(false);
    // console.log('Edit mode canceled, form data reverted');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 py-8 text-center">Loading...</div>;
  }
return (
  <div>
    <Navbar />
    <div className="min-h-screen pt-32 bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200 py-10">
      <div className="max-w-3xl mx-auto px-2">
        <div className="relative">
          {/* Profile avatar overlaps card */}
          <div className="absolute left-1/2 -top-20 transform -translate-x-1/2 z-10">
            <div className="w-40 h-40 bg-white border-4 border-orange-100 rounded-full shadow-xl flex items-center justify-center overflow-hidden">
              {formData.profile_picture ? (
                <img
                  src={`https://localhost:3000/profile/${formData.profile_picture}`}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-24 h-24 bg-orange-300 rounded-full flex items-center justify-center">
                  <span className="text-6xl">👤</span>
                </div>
              )}
            </div>
            {isEditable && (
              <label className="mt-2 mx-auto flex items-center justify-center cursor-pointer">
                <span className="text-xs bg-orange-50 px-3 py-1 rounded shadow text-orange-700 hover:bg-orange-100 font-semibold transition">Change Photo</span>
                <input
                  type="file"
                  name="profile_picture"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="pt-32 bg-white/90 rounded-2xl shadow-2xl border border-orange-100">
            <h1 className="text-3xl font-bold text-center text-orange-700 mb-2 pt-3 tracking-tight drop-shadow">
              My Profile
            </h1>
            <div className="flex items-center justify-center mb-6">
              <span className="block w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
              <span className="text-sm text-gray-500">Welcome, {formData.first_name || "User"}!</span>
            </div>
            <div className="px-5 pb-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="Your First Name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 bg-orange-50/70 text-gray-700 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Your Last Name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 bg-orange-50/70 text-gray-700 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase">Phone No</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 bg-orange-50/70 text-gray-700 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase">Country</label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Your Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 bg-orange-50/70 text-gray-700 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 bg-orange-50/70 text-gray-700 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-orange-700 mb-1 uppercase">Region/State</label>
                  <input
                    type="text"
                    name="region_state"
                    placeholder="Your Region/State"
                    value={formData.region_state}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 bg-orange-50/70 text-gray-700 transition"
                  />
                </div>
              </div>
              <div className="my-8 border-t border-orange-100"></div>
              <h3 className="text-md font-bold text-orange-600 mb-3 flex items-center gap-2">
                <DeliveryDining className="w-5 h-5 text-orange-400" />
                My Delivery Address
              </h3>
              <input
                type="text"
                name="address"
                placeholder="Your address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditable}
                className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 bg-orange-50/70 text-gray-700 transition"
              />
              <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-between items-center">
                <a
                  href="/forgotpassword"
                  className="px-6 py-3 border-2 border-orange-400 text-orange-700 rounded-lg font-semibold hover:bg-orange-100 transition text-center w-full sm:w-auto"
                >
                  Change your Password
                </a>
                <div className="flex gap-3 w-full sm:w-auto justify-center">
                  {!isEditable ? (
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition"
                    >
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition disabled:opacity-60"
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-8 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    <ToastContainer
      position="top-right"
      autoClose={2500}
      style={{ top: "8rem" }}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}
    />
  </div>
);
}
export default MyProfile;
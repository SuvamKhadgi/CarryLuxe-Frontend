import { Cog, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';
import { postWithCSRF } from '../../../utils/api';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await postWithCSRF(
        'https://localhost:3000/api/creds/contact',
        formData
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit contact message');
      }

      alert('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
return (
  <div className="">
    <Navbar />
    <div className="min-h-screen pt-32 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white/90 rounded-3xl shadow-2xl w-full max-w-4xl p-8 md:p-12 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-emerald-700 mb-4 tracking-tight drop-shadow">Contact Us</h1>
          {/* Illustration */}
        
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Get in Touch</h2>
          <p className="text-gray-600">Any questions or remarks? Let us know!</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="order-2 md:order-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-gray-50"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-gray-50"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type your message here"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-gray-50 resize-none"
                  required
                ></textarea>
              </div>
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-150 shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
          {/* Contact Information */}
          <div className="order-1 md:order-2">
            <div className="space-y-7">
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-gray-800 font-semibold">+977 254 8547 956</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-gray-800 font-semibold">Luxecarry@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-gray-800 font-semibold">Dillibazaar, Kathmandu-30 Nepal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);
}
export default ContactUs;
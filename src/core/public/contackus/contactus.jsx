import { Cog, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';

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
      const response = await fetch('https://localhost:3000/api/creds/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

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
      <div className="min-h-screen pt-32 bg-gray-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Contact us</h1>

            {/* Illustration */}
            <div className="relative mx-auto mb-6 w-80 h-60">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl"></div>

              {/* Computer Monitor */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-800 rounded-lg p-1 w-32 h-20">
                  <div className="bg-pink-500 rounded h-full w-full relative overflow-hidden">
                    <div className="absolute top-2 left-2 w-4 h-4 bg-white rounded opacity-80"></div>
                    <div className="absolute bottom-2 right-2 w-6 h-3 bg-white rounded opacity-60"></div>
                  </div>
                </div>
                <div className="bg-gray-700 h-2 w-6 mx-auto"></div>
                <div className="bg-gray-600 h-1 w-12 mx-auto rounded-full"></div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-6 left-8">
                <Cog className="w-8 h-8 text-pink-400 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div className="absolute top-4 right-12">
                <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
              </div>
              <div className="absolute bottom-8 left-6">
                <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
              </div>
              <div className="absolute bottom-6 right-8">
                <Cog className="w-6 h-6 text-red-400 animate-spin" style={{ animationDuration: '3s' }} />
              </div>

              {/* Person Figure */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                <div className="w-12 h-16 bg-red-500 rounded-t-full mx-auto -mt-2"></div>
              </div>

              {/* Side Person */}
              <div className="absolute bottom-8 right-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                <div className="w-8 h-12 bg-gray-700 rounded-t-full mx-auto -mt-1"></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-blue-600 mb-2">Get in Touch</h2>
            <p className="text-gray-600">Any question or remarks? Let us know!</p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Type your message here"
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <div className="order-1 md:order-2">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">+977 254 8547 956</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">Luxecarry@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-blue-600" />
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
};

export default ContactUs;
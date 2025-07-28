import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  Shield, 
  RefreshCw, 
  Users, 
  Phone, 
  Mail,
  Search,
  Star,
  Award,
  Package
} from 'lucide-react';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    { id: 'all', name: 'All Questions', icon: Search },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'returns', name: 'Returns', icon: RefreshCw },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'account', name: 'Account', icon: Users }
  ];

  const faqData = [
    // Shopping Questions
    {
      category: 'shopping',
      question: 'How do I find the right bag size for my needs?',
      answer: 'We provide detailed measurements for all our bags including length, width, and height. Each product page includes a size guide and suggested uses. For handbags, we recommend considering what you typically carry. Our customer service team can also provide personalized recommendations based on your specific needs.'
    },
    {
      category: 'shopping',
      question: 'Are LuxeCarry bags authentic luxury items?',
      answer: 'Yes, all bags listed under luxury brand categories (Prada, Gucci, Louis Vuitton, etc.) are 100% authentic. We have strict authentication processes and work only with verified suppliers. Each luxury item comes with authenticity certificates and our authenticity guarantee.'
    },
    {
      category: 'shopping',
      question: 'Do you offer gift wrapping services?',
      answer: 'Yes! We offer premium gift wrapping services for an additional fee. Choose from elegant gift boxes, luxury wrapping paper, and personalized gift messages. Gift wrapping options are available during checkout.'
    },
    {
      category: 'shopping',
      question: 'Can I see more product images before purchasing?',
      answer: 'Absolutely! Each product page includes multiple high-resolution images from different angles. You can zoom in to see details, materials, and craftsmanship. If you need additional photos, contact our customer service team.'
    },

    // Shipping Questions
    {
      category: 'shipping',
      question: 'What are your shipping options and costs?',
      answer: 'We offer several shipping options: Standard shipping (5-7 business days) for free, Express shipping (2-3 business days) for Rs.100, and Next-day delivery for Rs.300. Free standard shipping is available on orders over RS500. International shipping is available with rates calculated at checkout.'
    },
    {
      category: 'shipping',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email and SMS. You can track your package on our website under "My Orders" or directly on the carrier\'s website. We provide real-time updates on your order status.'
    },
    {
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 50 countries worldwide. International shipping costs vary by destination and are calculated at checkout. Please note that customs duties and taxes are the responsibility of the customer and are not included in our shipping costs.'
    },
    {
      category: 'shipping',
      question: 'What happens if my package is lost or damaged?',
      answer: 'All our shipments are fully insured. If your package is lost or arrives damaged, contact us immediately. We\'ll work with the carrier to resolve the issue and will send a replacement or provide a full refund if necessary.'
    },

    // Payment Questions
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Buy Now Pay Later options through Klarna and Afterpay. All payments are processed securely with SSL encryption.'
    },
    {
      category: 'payment',
      question: 'Is it safe to shop on your website?',
      answer: 'Yes, absolutely! Our website uses 256-bit SSL encryption to protect your personal and payment information. We are PCI DSS compliant and never store your credit card information on our servers. Look for the padlock icon in your browser for security confirmation.'
    },
    {
      category: 'payment',
      question: 'Do you offer payment plans?',
      answer: 'Yes! We partner with Klarna and Afterpay to offer flexible payment options. You can split your purchase into 4 interest-free installments or choose longer payment terms. These options are available at checkout for qualifying purchases.'
    },
    {
      category: 'payment',
      question: 'Why was my payment declined?',
      answer: 'Payment declines can occur for several reasons: insufficient funds, expired card, incorrect billing information, or bank security measures. Double-check your payment details and try again. If problems persist, contact your bank or try an alternative payment method.'
    },

    // Returns Questions
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unworn, unused items in original packaging. Items must be returned in the same condition as received. Original tags and authenticity cards must be included. Return shipping is free for defective items, otherwise customer pays return shipping.'
    },
    {
      category: 'returns',
      question: 'How do I initiate a return?',
      answer: 'To start a return, log into your account and go to "My Orders." Select the item you want to return and choose your reason. We\'ll provide a prepaid return label and instructions. You can also contact customer service for assistance with the return process.'
    },
    {
      category: 'returns',
      question: 'How long does it take to process a refund?',
      answer: 'Once we receive your returned item, we\'ll inspect it and process your refund within 3-5 business days. Refunds are issued to the original payment method. Credit card refunds typically appear within 5-7 business days, while PayPal refunds are usually instant.'
    },
    {
      category: 'returns',
      question: 'Can I exchange an item instead of returning it?',
      answer: 'Currently, we don\'t offer direct exchanges. To get a different size or color, you\'ll need to return the original item and place a new order. This ensures you get the item you want quickly and allows us to process your request faster.'
    },

    // Product Questions
    {
      category: 'products',
      question: 'How do I care for my leather bags?',
      answer: 'Leather bags require proper care to maintain their beauty. Keep them away from direct sunlight and moisture. Use a leather conditioner every 3-6 months. For cleaning, use a soft, damp cloth and leather-specific cleaners. Store in dust bags when not in use. We provide care instructions with each leather purchase.'
    },
    {
      category: 'products',
      question: 'Are your bags made from genuine leather?',
      answer: 'Yes, all our leather bags are made from genuine leather unless otherwise specified. We use various types including full-grain, top-grain, and genuine leather. Product descriptions clearly indicate the leather type and quality. We also offer vegan leather alternatives for customers who prefer cruelty-free options.'
    },
    {
      category: 'products',
      question: 'Do you offer custom or personalized bags?',
      answer: 'We offer monogramming and personalization services on select bags. Options include initials, names, or custom text in various fonts and colors. Personalized items take an additional 3-5 business days to complete and are non-returnable. Contact us for personalization options on specific products.'
    },
    {
      category: 'products',
      question: 'What\'s the difference between your bag categories?',
      answer: 'Our bags are categorized by style and function: Handbags (everyday carry), Tote Bags (spacious and versatile), Clutches (evening and formal), Backpacks (hands-free convenience), Travel Bags (luggage and weekenders), and Wallets (small accessories). Each category is designed for specific needs and occasions.'
    },

    // Account Questions
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click "Sign Up" at the top of our website and fill in your email, password, and basic information. You can also create an account during checkout. Having an account allows you to track orders, save favorites, access exclusive deals, and speed up future purchases.'
    },
    {
      category: 'account',
      question: 'I forgot my password. How do I reset it?',
      answer: 'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a secure link to reset your password. If you don\'t receive the email within 10 minutes, check your spam folder or contact customer service for help.'
    },
    {
      category: 'account',
      question: 'How do I update my account information?',
      answer: 'Log into your account and go to "My Profile" to update your personal information, addresses, and preferences. You can also manage your email subscriptions and view your order history. Changes are saved automatically when you click "Update."'
    },
    {
      category: 'account',
      question: 'Do you have a loyalty program?',
      answer: 'Yes! Our LuxeCarry Rewards program offers points for every purchase, exclusive member discounts, early access to sales, and birthday rewards. You earn 1 point per dollar spent, and 100 points = $5 in rewards. Join free when you create an account.'
    }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="">
        <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600">Find answers to common questions about LuxeCarry</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-lg font-medium text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-full">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h2>
            <p className="text-gray-600">Our customer service team is here to assist you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-2">Sun-Fri: 9AM-7PM </p>
              <p className="text-blue-600 font-medium">+977 98123456789</p>
            </div>

            

            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-2">Available SOON</p>
              
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-2">Response within 24 hours</p>
              <p className="text-purple-600 font-medium">luxecarry@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">Secure Shopping</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">Authentic Products</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Truck className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">Fast Shipping</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <RefreshCw className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">Easy Returns</p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>

    </div>
  );
};

export default FAQ;
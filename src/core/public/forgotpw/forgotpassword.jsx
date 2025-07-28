import { useState } from 'react';
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DOMPurify from 'dompurify';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        const sanitizedEmail = DOMPurify.sanitize(email.trim());
        if (!sanitizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
            toast.error("Please enter a valid email");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('https://localhost:3000/api/creds/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: sanitizedEmail }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Password reset link sent to your email");
            } else {
                toast.error(data.message || "Failed to send reset link");
            }
        } catch (error) {
            console.error("Error sending reset link:", error);
            toast.error("Error sending reset link");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen pt-32 bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full flex items-center gap-8">
                    <div className="flex-1 flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="w-32 h-52 bg-blue-600 rounded-2xl relative transform rotate-12 shadow-lg">
                                <div className="absolute inset-4 bg-white rounded-lg flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="w-8 h-1 bg-red-400 rounded mb-1"></div>
                                    <div className="w-6 h-1 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            <div className="absolute -left-4 top-4 w-8 h-10 bg-yellow-400 rounded-t-full rounded-b-sm shadow-lg">
                                <div className="w-2 h-2 bg-gray-800 rounded-full mx-auto mt-2"></div>
                            </div>
                            <div className="absolute -right-8 bottom-8 w-12 h-4 bg-gray-300 rounded-full shadow-lg">
                                <div className="w-3 h-3 bg-gray-400 rounded-full mt-0.5 ml-1"></div>
                                <div className="w-6 h-0.5 bg-gray-400 ml-4 -mt-1.5"></div>
                            </div>
                            <div className="absolute -top-2 -right-4 w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-orange-600 font-bold text-sm">?</span>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 text-center">
                            Forgot The Password
                        </h2>
                    </div>
                    <div className="flex-1 max-w-md">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                FORGOT<br />PASSWORD ?
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Please enter your email address to receive a password reset link.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Sending...' : 'Next'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={6000}
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
            <Footer />
        </div>
    );
}
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import zxcvbn from 'zxcvbn';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';
import { postWithCSRF } from '../../../utils/api';

export default function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: -1, label: '', color: '' });
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const resetToken = query.get('token');
        if (resetToken) {
            setToken(DOMPurify.sanitize(resetToken));
        } else {
            toast.error("Invalid or missing reset token");
            navigate('/forgotpassword');
        }
    }, [location, navigate]);

    useEffect(() => {
        if (newPassword) {
            const result = zxcvbn(newPassword);
            const score = result.score;
            let label, color;
            switch (score) {
                case 0:
                    label = 'Weak';
                    color = 'text-red-600';
                    break;
                case 1:
                    label = 'Fair';
                    color = 'text-orange-600';
                    break;
                case 2:
                    label = 'Good';
                    color = 'text-yellow-600';
                    break;
                case 3:
                    label = 'Strong';
                    color = 'text-green-600';
                    break;
                case 4:
                    label = 'Excellent';
                    color = 'text-blue-600';
                    break;
                default:
                    label = '';
                    color = '';
            }
            setPasswordStrength({ score, label, color });
        } else {
            setPasswordStrength({ score: -1, label: '', color: '' });
        }
    }, [newPassword]);

    const handleSubmit = async () => {
        const sanitizedNewPassword = DOMPurify.sanitize(newPassword.trim());
        const sanitizedConfirmPassword = DOMPurify.sanitize(confirmPassword.trim());

        if (!sanitizedNewPassword || !sanitizedConfirmPassword) {
            toast.error("Please fill in both password fields");
            return;
        }

        if (sanitizedNewPassword !== sanitizedConfirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (passwordStrength.score < 3) {
            toast.error("Password must be at least Strong (score 3 or higher)");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await postWithCSRF(
                'https://localhost:3000/api/creds/reset-password',
                { token, newPassword: sanitizedNewPassword }
            );

            const data = await response.json();
            if (response.ok) {
                toast.success("Password reset successfully! Redirecting to login...");
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.error(data.message || data.error || "Failed to reset password");
            }
        } catch (error) {
            // console.error("Error resetting password:", error);
            toast.error("Error resetting password: Network error");
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
                            Reset Your Password
                        </h2>
                    </div>
                    <div className="flex-1 max-w-md">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                RESET<br />PASSWORD
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Enter your new password below.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="Enter new password"
                                />
                                {passwordStrength.label && (
                                    <p className={`text-sm mt-1 ${passwordStrength.color}`}>
                                        Password strength: {passwordStrength.label}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
            <Footer />
        </div>
    );
}
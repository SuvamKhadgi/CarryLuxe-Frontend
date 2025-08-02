import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';
import { useLoginMutation } from './creadsquery';
import ReCAPTCHA from "react-google-recaptcha";
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA.");
      return;
    }
    loginMutation.mutate(
      { email, password, recaptchaToken },
      {
        onSuccess: (response) => {
          // console.log('Full response:', response.data); // Debug the response
          if (response.data.mfaRequired) {
            toast.info('Please verify MFA code sent to your email.');
            navigate('/mfa-verify', { state: { email } });
          } else {
            toast.success('Login successful!');
            let role = response.data.user?.role;
            // Fallback to token if role is incorrect or missing
            if (response.data.token) {
              try {
                const decodedToken = jwtDecode(response.data.token);
                // console.log('Decoded token:', decodedToken); // Debug token
                role = decodedToken.role || role; // Use token role if available
              } catch (error) {
                // console.error('Error decoding token:', error);
              }
            }
            // console.log('User role:', role);
            navigate(role === 'admin' ? '/admindashboard' : '/');
          }
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || 'Login failed. Please try again.');
          setPassword('');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center pt-32 py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">User Login</h2>
          <p className="text-gray-600 mb-6 text-center">Welcome back! Please enter your credentials.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                aria-required="true"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex items-center">
              <input type="checkbox" required className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded" />
              <label className="ml-2 text-sm text-gray-600">Accept Terms and Conditions</label>
            </div>
            <ReCAPTCHA
              sitekey="6LewlJErAAAAAC_yaTlONNQlh-zuL_3rZPNFTCnB"
              onChange={token => setRecaptchaToken(token)}
            />
            <button
              type="submit"
              disabled={loginMutation.isLoading}
              className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            >
              {loginMutation.isLoading ? 'Logging in...' : 'Log in'}
            </button>
            <div className="flex justify-between text-sm text-gray-600">
              <a href="/forgotpassword" className="hover:underline">Forgot Password?</a>
              <p>
                Don't have an account? <a href="/signup" className="text-cyan-600 hover:underline">Sign up</a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} closeOnClick pauseOnHover theme="colored" />
      <Footer />
    </div>
  );
};

export default LoginPage;
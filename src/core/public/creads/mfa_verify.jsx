import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';
import { useLoginMutation } from './creadsquery';

const MFAVerify = () => {
  const [mfaToken, setMfaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { email } = state || {};
  const loginMutation = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    loginMutation.mutate(
      { email, mfaToken },
      {
        onSuccess: (response) => {
          toast.success('MFA verified! You are now logged in.');
          const role = response.data.user.role;
          localStorage.setItem('isAuthenticated', 'true');
          setTimeout(() => {
            navigate(role === 'admin' ? '/admindashboard' : '/', { replace: true });
          }, 2000);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Invalid MFA code');
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center pt-32 py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Verify MFA Code</h2>
          <p className="text-gray-600 mb-6 text-center">Enter the 6-digit code sent to {email}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="mfaToken" className="block text-sm font-medium text-gray-700">MFA Code</label>
              <input
                id="mfaToken"
                type="text"
                value={mfaToken}
                onChange={(e) => setMfaToken(e.target.value)}
                required
                maxLength={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} closeOnClick pauseOnHover theme="colored" />
      <Footer />
    </div>
  );
};

export default MFAVerify;
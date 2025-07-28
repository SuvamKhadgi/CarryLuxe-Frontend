import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Payment Successful!", { autoClose: 3000 });
    toast.success("Your order has been placed successfully");
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="flex items-center justify-center mb-8">
        <img src="../src/assets/images/esewa.jpg" alt="eSewa Icon" className="w-10 h-10 mr-2" />
        <div className="text-white text-3xl font-bold">eSewa</div>
      </div>
      <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-green-400">Payment Success!</h2>
        <p className="text-gray-300 mt-2">
          <img
            src="../src/assets/images/tick.gif"
            alt="Success"
            className="w-96 h-64 object-cover rounded-lg shadow-md"
          />
        </p>
        <p className="text-orange-400 mt-4 text-lg font-bold">
          Redirecting back to HomeScreen...
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={2500} style={{ top: "8rem" }} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="colored" />
    </div>
  );
};

export default Success;
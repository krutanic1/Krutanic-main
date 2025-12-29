import { useState } from "react";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Setting = () => {
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== rePassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);
    try {
      const email = localStorage.getItem("userEmail");
      const response = await axios.put(`${API}/updatepassword`, {
        email,
        newPassword,
      });
      toast.success("Password updated successfully!");
      setNewPassword("");
      setRePassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="setting flex items-center">
      <div className="max-w-md mx-auto p-6 mt-20 bg-white rounded-lg border shadow-md">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Change Password
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          {/* <label 
            htmlFor="NewPassword" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Password
          </label> */}
          <input
            type={showNewPassword ? "text" : "password"}
            id="NewPassword"
            name="NewPassword"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
            required
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
          </span>
        </div>

        <div className="relative">
          {/* <label 
            htmlFor="RePassword" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label> */}
          <input
            type={showRePassword ? "text" : "password"}
            id="RePassword"
            name="RePassword"
            placeholder="Confirm new password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500  outline-none transition-colors"
            required
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setShowRePassword(!showRePassword)}
          >
            {showRePassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
          </span>
        </div>

        <div className="text-sm text-gray-600">
          Password must be at least 8 characters long
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              Updating...
            </span>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
    </div>
  );
};

export default Setting;
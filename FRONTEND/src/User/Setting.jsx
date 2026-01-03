import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/LOGO3.png";

const Setting = () => {
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    toast.success("Logout successful!");
    setTimeout(() => {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      navigate("/Login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-display">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/Dashboard" className="flex items-center gap-2">
              <img src={logo} alt="Krutanic" className="h-8" />
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile back button */}
              <Link
                to="/Dashboard"
                className="flex sm:hidden items-center justify-center size-10 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </Link>
              {/* Desktop back button */}
              <Link
                to="/Dashboard"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">lock</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Change Password</h1>
            <p className="text-gray-500">Update your password to keep your account secure</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password Field */}
                <div>
                  <label htmlFor="NewPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 text-xl">lock</span>
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="NewPassword"
                      name="NewPassword"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showNewPassword ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="RePassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 text-xl">lock_reset</span>
                    </div>
                    <input
                      type={showRePassword ? "text" : "password"}
                      id="RePassword"
                      name="RePassword"
                      placeholder="Confirm new password"
                      value={rePassword}
                      onChange={(e) => setRePassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowRePassword(!showRePassword)}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showRePassword ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">info</span>
                    Password Requirements
                  </h4>
                  <ul className="space-y-2">
                    <li className={`flex items-center gap-2 text-sm ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="material-symbols-outlined text-lg">
                        {newPassword.length >= 8 ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      At least 8 characters long
                    </li>
                    <li className={`flex items-center gap-2 text-sm ${newPassword === rePassword && rePassword.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="material-symbols-outlined text-lg">
                        {newPassword === rePassword && rePassword.length > 0 ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      Passwords match
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 px-4 bg-primary text-white rounded-xl font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30 ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">security</span>
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Setting;
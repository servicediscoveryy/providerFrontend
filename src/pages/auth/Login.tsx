import React, { useState } from "react";
import { Mail, KeyRound, ArrowRight } from "lucide-react";
import axios from "axios";
import { BASEURL } from "../../constant";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/userSlices";
const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); try {

      setLoading(true);
      const response = await axios.post(BASEURL + "/api/v1/auth/login", { email: email });
      console.log(response.data)
      if (response.data.success) {
        alert("otp sent successfull");
        setShowOtp(true);
        setLoading(false)
      }

    } catch (error) {
      alert(error.response.data.message)
      setLoading(false)
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(BASEURL + "/api/v1/auth/verify", { otp: otp, email: email });
      // data.token,user,success
      if (response.data.success) {
        sessionStorage.setItem("token", response.data.data.token)
        sessionStorage.setItem("user", JSON.stringify(response.data.data.data))
        dispatch(login(response.data.data.data))
        alert("Login successful!");
        setLoading(false);
        navigate("/")
      }
    } catch (error) {
      console.log(error)

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white md:h-[600px]">
        {/* Left Side (Hidden on Small Screens) */}
        <div className="hidden md:flex w-1/2 relative items-center justify-center bg-black text-white p-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Welcome Back!</h2>
            <p className="text-lg opacity-90 mt-2">
              Sign in to continue your journey
            </p>
          </div>
        </div>

        {/* Right Side (Login Form) */}
        <div className="w-full md:w-1/2 p-6 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {showOtp ? "Enter OTP" : "Sign In"}
            </h1>
            <p className="text-gray-600 text-lg">
              {showOtp
                ? "Please enter the OTP sent to your email"
                : "Enter your email to receive an OTP"}
            </p>
          </div>

          <div className="flex-grow flex flex-col">
            {!showOtp ? (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl text-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition flex items-center justify-center gap-2"
                >
                  {loading ? "Sending OTP..." : <>Request OTP <ArrowRight className="h-5 w-5" /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-lg font-medium text-gray-700 mb-2">
                    One-Time Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter OTP"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl text-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition flex items-center justify-center gap-2"
                  >
                    {loading ? "Verifying..." : <>Verify OTP <ArrowRight className="h-5 w-5" /></>}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowOtp(false)}
                    className="text-lg text-gray-600 hover:text-gray-900"
                  >
                    Back to email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

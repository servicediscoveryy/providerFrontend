import React, { useState } from "react";
import { Mail, KeyRound, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setShowOtp(true);
      setLoading(false);
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      alert("Login successful!");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className=" flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-2xl">
        <div className="w-1/2 relative hidden md:block h-[600px]">
          <div className="bg-black text-white p-2 rounded h-full text-center flex items-center justify-center">
            <span className="font-bold text-5xl">SC</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute top-8 left-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-lg opacity-90">
              Sign in to continue your journey
            </p>
          </div>
        </div>

        <div className="w-full md:w-[80%] bg-white p-8 sm:p-12 h-[600px] flex flex-col">
          <div className="flex-shrink-0 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
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
              <form onSubmit={handleEmailSubmit} className="space-y-8">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-lg font-medium text-gray-700 mb-3"
                  >
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
                  {loading ? (
                    "Sending OTP..."
                  ) : (
                    <>
                      Request OTP <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-8">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-lg font-medium text-gray-700 mb-3"
                  >
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
                    {loading ? (
                      "Verifying..."
                    ) : (
                      <>
                        Verify OTP <ArrowRight className="h-5 w-5" />
                      </>
                    )}
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // your axios instance

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1 = enter email, Step 2 = enter OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setInfo(res.data.message || "OTP sent to your email!");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // Step 2: Verify OTP and login
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      const { token, user } = res.data;

      // Save token & user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setInfo("OTP verified! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard"); // redirect user to dashboard
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1560448073-8b8f3f9a8a5f?auto=format&fit=crop&w=1600&q=80')`,
      }}
    >
      <div className="max-w-md w-full bg-white/30 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
          {step === 1 ? "Forgot Password" : "Enter OTP"}
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {info && <p className="text-green-300 mb-4">{info}</p>}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/70 placeholder-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/70 placeholder-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
            >
              Verify OTP
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-white/80">
          Remembered your password?{" "}
          <span
            className="text-indigo-400 cursor-pointer hover:text-indigo-200 transition"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

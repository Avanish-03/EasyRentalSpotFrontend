import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../../api/authApi";
import bgimg from "../../../assets/bgimg.jpeg";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // ✅ CORRECT ADMIN API
      const res = await adminLogin({ email, password });
      const { token, user } = res.data;

      // safety check (optional)
      if (user.role !== "Admin") {
        setError("Not an admin account");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", "Admin");
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      <div className="max-w-md w-full bg-white/30 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Admin Login
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/70 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/70 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

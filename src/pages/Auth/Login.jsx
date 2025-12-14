import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios"; // axios instance
import { loginUser } from "../../api/authApi";
import bgimg from "../../assets/bgimg.jpeg";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles");
        setRoles(res.data);
        if (res.data.length > 0) setSelectedRole(res.data[0].name);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password, role: selectedRole });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based routing
      if (selectedRole === "Owner") navigate("/dashboard/owner");
      else if (selectedRole === "Tenant") navigate("/dashboard/tenant");
      else navigate("/dashboard/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      <div className="max-w-md w-full bg-white/30 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
          Login
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/70 placeholder-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/70 placeholder-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          {/* Radio buttons for role selection */}
          <div className="mt-4">
            <p className="text-white mb-2 font-medium drop-shadow">Select Role:</p>
            <div className="flex gap-4 flex-wrap">
              {roles.slice(0,2).map((role) => (
                <label
                  key={role._id}
                  className="flex items-center gap-2 text-white drop-shadow cursor-pointer"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.name}
                    checked={selectedRole === role.name}
                    onChange={() => setSelectedRole(role.name)}
                    className="accent-indigo-600 w-4 h-4"
                  />
                  {role.name}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <div className="mt-4 flex justify-between items-center text-white/80 text-sm">
          <p>
            Don't have an account?{" "}
            <span
              className="text-indigo-800 cursor-pointer hover:font-semibold transition"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
          <Link
            to="/forgot-password"
            className="text-indigo-700 hover:font-semibold transition"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

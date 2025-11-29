import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // axios instance
import { loginUser } from "../../api/authApi";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);       // list of roles
  const [selectedRole, setSelectedRole] = useState(""); // chosen role
  const [error, setError] = useState("");

  // Fetch roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles");
        setRoles(res.data);

        if (res.data.length > 0) {
          setSelectedRole(res.data[0].name);
        }
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
      console.log(res);

      // Save token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based routing
      // Use selectedRole from dropdown instead of DB role
      if (selectedRole === "Owner") navigate("/dashboard/owner");
      else if (selectedRole === "Tenant") navigate("/dashboard/tenant");
      else navigate("/dashboard/admin");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {/* Role Selector */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            {roles.map((role) => (
              <option key={role._id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { registerUser } from "../../api/authApi";
import bgimg from "../../assets/bgimg.jpeg";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles");
        setRoles(res.data);
        if (res.data.length > 0) {
          setRoleId(res.data[0]._id);
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const selectedRole = roles.find((r) => r._id === roleId);

    try {
      await registerUser({
        fullName,
        email,
        password,
        phone,
        roleName: selectedRole.name,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      <div className="max-w-md w-full bg-white/30 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
          Register
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/70 placeholder-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/70 placeholder-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

          {/* Role selection */}
          <div className="mt-4">
            <p className="text-white mb-2 font-medium drop-shadow">Select Role:</p>
            <div className="flex gap-4 flex-wrap">
              {roles.map((role) => (
                <label
                  key={role._id}
                  className="flex items-center gap-2 text-white drop-shadow cursor-pointer"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role._id}
                    checked={roleId === role._id}
                    onChange={() => setRoleId(role._id)}
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
            Register
          </button>
        </form>

        <div className="mt-4 flex justify-between items-center text-white/80 text-sm">
          <p>
            Already have an account?{" "}
            <span
              className="text-indigo-800 cursor-pointer hover:text-indigo-900 transition"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
          
        </div>
      </div>
    </div>
  );
}

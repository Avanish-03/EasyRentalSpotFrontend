import React, { useEffect, useState } from "react";
import {
  getAdminProfile,
  updateAdminProfile,
  adminChangePassword,
} from "../../../api/adminApi";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [pwd, setPwd] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getAdminProfile();
      setProfile(res.data.user);
      setForm({
        fullName: res.data.user.fullName || "",
        email: res.data.user.email || "",
        phone: res.data.user.phone || "",
      });
    } catch (err) {
      console.error("Failed to load admin profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateAdminProfile(form);
      alert("Profile updated");
      loadProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async () => {
    if (!pwd.oldPassword || !pwd.newPassword) {
      return alert("Both fields required");
    }

    try {
      await adminChangePassword(pwd);
      alert("Password changed successfully");
      setPwd({ oldPassword: "", newPassword: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Profile Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={form.fullName}
            onChange={(v) => setForm({ ...form, fullName: v })}
          />

          <Input
            label="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <Input
            label="Phone"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
        </div>

        <button
          onClick={handleUpdateProfile}
          className="mt-4 rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>

      {/* PASSWORD CARD */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Change Password
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="password"
            label="Old Password"
            value={pwd.oldPassword}
            onChange={(v) => setPwd({ ...pwd, oldPassword: v })}
          />

          <Input
            type="password"
            label="New Password"
            value={pwd.newPassword}
            onChange={(v) => setPwd({ ...pwd, newPassword: v })}
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="mt-4 rounded bg-purple-600 px-5 py-2 text-white hover:bg-purple-700"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

/* ---------------- UI INPUT ---------------- */

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

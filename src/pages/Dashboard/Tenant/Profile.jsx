import React, { useEffect, useState } from "react";
import {
  getTenantProfile,
  updateTenantProfile,
  updateTenantAvatar,
  changeTenantPassword,
} from "../../../api/tenantApi";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getTenantProfile();

      // ✅ FIX 1: correct response shape
      const u = res.data.user;

      setUser(u);
      setForm({
        fullName: u.fullName || "",
        email: u.email || "",
        phone: u.phone || "",
      });

      // ✅ FIX 2: correct avatar field
      setAvatarPreview(
        u.avatar ? `http://localhost:5000${u.avatar}` : null
      );
    } catch (err) {
      console.error("Failed to load tenant profile", err);
    } finally {
      setLoading(false); // ✅ loader ALWAYS stops
    }
  };

  /* ---------------- UPDATE PROFILE ---------------- */
  const handleProfileUpdate = async () => {
    try {
      setSaving(true);
      await updateTenantProfile(form);
      await loadProfile();
    } catch (err) {
      console.error("Profile update failed", err);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- AVATAR UPLOAD ---------------- */
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append("avatar", file);

    try {
      await updateTenantAvatar(fd);
      await loadProfile();
    } catch (err) {
      console.error("Avatar upload failed", err);
    }
  };

  /* ---------------- PASSWORD CHANGE ---------------- */
  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) return;

    try {
      setSaving(true);

      // ✅ FIX 3: correct payload keys
      await changeTenantPassword({
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Password change failed", err);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 space-y-8">

      {/* PROFILE HEADER */}
      <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow">
        <img
          src={
            avatarPreview ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="avatar"
          className="h-20 w-20 rounded-full border object-cover"
        />

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {user.fullName}
          </h2>
          <p className="text-gray-500">{user.email}</p>

          <label className="mt-2 inline-block cursor-pointer text-sm text-indigo-600 hover:underline">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            Change Avatar
          </label>
        </div>
      </div>

      {/* EDIT PROFILE */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Edit Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
          />

          <input
            className="border rounded px-3 py-2"
            placeholder="Full Name"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className="border rounded px-3 py-2"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleProfileUpdate}
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Change Password
        </h3>

        <input
          type="password"
          className="border rounded px-3 py-2 w-full"
          placeholder="Current Password"
          value={passwordForm.currentPassword}
          onChange={(e) =>
            setPasswordForm({
              ...passwordForm,
              currentPassword: e.target.value,
            })
          }
        />

        <input
          type="password"
          className="border rounded px-3 py-2 w-full"
          placeholder="New Password"
          value={passwordForm.newPassword}
          onChange={(e) =>
            setPasswordForm({
              ...passwordForm,
              newPassword: e.target.value,
            })
          }
        />

        <button
          onClick={handlePasswordChange}
          disabled={saving}
          className="rounded-lg bg-gray-800 px-5 py-2 text-white hover:bg-gray-900 disabled:opacity-60"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  getOwnerProfile,
  updateOwnerProfile,
  updateOwnerAvatar,
  changeOwnerPassword,
} from "../../../api/ownerApi";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const API_BASE = "http://localhost:5000";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    bio: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getOwnerProfile();

      const u = res.data?.user || res.data;
      setUser(u);

      setForm({
        fullName: u.fullName || "",
        phone: u.phone || "",
        bio: u.bio || "",
      });

      setAvatarPreview(
        u.avatar ? `${API_BASE}${u.avatar}` : DEFAULT_AVATAR
      );
    } catch (err) {
      console.error("Profile load failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UPDATE PROFILE ---------------- */
  const handleUpdateProfile = async () => {
    if (saving) return;

    try {
      setSaving(true);
      setMessage("");
      await updateOwnerProfile(form);
      await loadProfile();
      setMessage("✅ Profile updated successfully");
    } catch (err) {
      setMessage("❌ Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UPDATE AVATAR ---------------- */
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);

    const fd = new FormData();
    fd.append("avatar", file);

    try {
      await updateOwnerAvatar(fd);
      await loadProfile();
      setMessage("✅ Avatar updated");
    } catch (err) {
      setMessage("❌ Avatar upload failed");
    } finally {
      URL.revokeObjectURL(preview);
    }
  };

  /* ---------------- CHANGE PASSWORD ---------------- */
  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) return;

    try {
      setPasswordSaving(true);
      setMessage("");
      await changeOwnerPassword(passwordForm);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
      });

      setMessage("✅ Password updated successfully");
    } catch (err) {
      setMessage("❌ Incorrect current password");
    } finally {
      setPasswordSaving(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">

      {/* MESSAGE */}
      {message && (
        <div className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-700">
          {message}
        </div>
      )}

      {/* ================= PROFILE HEADER ================= */}
      <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow">
        <img
          src={avatarPreview}
          alt="avatar"
          className="h-24 w-24 rounded-full border object-cover"
        />

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-800">
            {user.fullName}
          </h2>

          <p className="text-gray-500">{user.email}</p>

          {user.phone && <p className="text-sm">📞 {user.phone}</p>}
          {user.bio && <p className="text-sm">📝 {user.bio}</p>}

          <label className="inline-block mt-3 cursor-pointer text-sm text-indigo-600 hover:underline">
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

      {/* ================= EDIT PROFILE ================= */}
      <div className="rounded-xl grid bg-white p-6 shadow space-y-4">
        <h3 className="text-xl font-semibold">Edit Profile</h3>

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
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <textarea
          rows={3}
          className="border rounded px-3 py-2"
          placeholder="Bio"
          value={form.bio}
          onChange={(e) =>
            setForm({ ...form, bio: e.target.value })
          }
        />

        <button
          onClick={handleUpdateProfile}
          disabled={saving}
          className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* ================= CHANGE PASSWORD ================= */}
      <div className="rounded-xl bg-white p-6 shadow space-y-4">
        <h3 className="text-xl font-semibold">Change Password</h3>

        <input
          type="password"
          className="border rounded px-3 py-2"
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
          className="border rounded px-3 py-2"
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
          disabled={passwordSaving}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {passwordSaving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}

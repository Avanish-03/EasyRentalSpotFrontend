import React, { useEffect, useState } from "react";
import {
  getOwnerProfile,
  updateOwnerProfile,
  updateOwnerAvatar,
  changeOwnerPassword,
} from "../../../api/ownerApi";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    bio: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getOwnerProfile();

      const data = res.data;
      setUser(data);

      setForm({
        fullName: data.fullName || "",
        phone: data.phone || "",
        bio: data.bio || "",
      });

      setAvatarPreview(data.avatarUrl || DEFAULT_AVATAR);
    } catch (err) {
      console.error("Failed to load profile", err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UPDATE PROFILE ---------------- */
  const handleUpdateProfile = async () => {
    if (saving) return;

    setSaving(true);
    try {
      await updateOwnerProfile(form);
      await loadProfile();
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UPDATE AVATAR ---------------- */
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await updateOwnerAvatar(formData);
      await loadProfile();
      alert("Avatar updated successfully");
    } catch (err) {
      alert("Failed to update avatar");
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  /* ---------------- CHANGE PASSWORD ---------------- */
  const handlePasswordChange = async () => {
    if (passwordSaving) return;

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      return alert("Both fields are required");
    }

    setPasswordSaving(true);
    try {
      await changeOwnerPassword(passwordForm);
      alert("Password updated successfully");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Incorrect current password");
    } finally {
      setPasswordSaving(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 space-y-8">
      {/* PROFILE HEADER */}


      <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow">
        <img
          src={avatarPreview || DEFAULT_AVATAR}
          alt="avatar"
          className="h-20 w-20 rounded-full border object-cover"
        />

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-800">
            {user.fullName}
          </h2>

          <p className="text-gray-500 text-sm">
            {user.email}
          </p>

          {/* EXTRA DETAILS */}
          {user.phone && (
            <p className="text-sm text-gray-600">
              📞 {user.phone}
            </p>
          )}

          {user.bio && (
            <p className="mt-1 text-sm text-gray-600 max-w-lg">
              📝 {user.bio}
            </p>
          )}

          {user.role && (
            <span className="inline-block mt-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              {typeof user.role === "string" ? user.role : user.role.name}
            </span>
          )}

          {/* CHANGE AVATAR */}
          <label className="mt-3 inline-block cursor-pointer text-sm text-blue-600 hover:underline">
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
      <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Edit Profile
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded border px-3 py-2"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
          />

          <input
            className="rounded border px-3 py-2"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <textarea
            className="rounded border px-3 py-2 md:col-span-2"
            rows={3}
            placeholder="Bio"
            value={form.bio}
            onChange={(e) =>
              setForm({ ...form, bio: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleUpdateProfile}
          disabled={saving}
          className="mt-4 rounded-lg bg-purple-600 px-5 py-2 text-white hover:bg-purple-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Change Password
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="password"
            className="rounded border px-3 py-2"
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
            className="rounded border px-3 py-2"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={handlePasswordChange}
          disabled={passwordSaving}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {passwordSaving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}

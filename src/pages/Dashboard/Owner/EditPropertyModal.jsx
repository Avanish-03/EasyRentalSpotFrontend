import React, { useEffect, useState } from "react";
import { updateProperty } from "../../../api/ownerApi";
import { getAllLocations } from "../../../api/locationApi";

export default function EditPropertyModal({ property, onClose, onSuccess }) {
  const [form, setForm] = useState({ ...property });
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    const res = await getAllLocations();
    setLocations(res.data.locations || []);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await updateProperty(property._id, {
        title: form.title,
        description: form.description,
        propertyType: form.propertyType,
        price: Number(form.price),
        area: Number(form.area),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        locationId: form.locationId,
      });

      await onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="border-b px-6 py-4 flex justify-between">
          <h2 className="text-lg font-semibold">Edit Property</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <select
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="other">Other</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
            <input
              name="area"
              type="number"
              value={form.area}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="bedrooms"
              type="number"
              value={form.bedrooms}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
            <input
              name="bathrooms"
              type="number"
              value={form.bathrooms}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
          </div>

          <select
            name="locationId"
            value={form.locationId?._id || form.locationId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            {locations.map((l) => (
              <option key={l._id} value={l._id}>
                {l.city} - {l.postalCode}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-5 py-2 bg-purple-600 text-white rounded"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

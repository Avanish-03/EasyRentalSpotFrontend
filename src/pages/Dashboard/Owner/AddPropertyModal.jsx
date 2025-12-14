import React, { useEffect, useState } from "react";
import { createProperty } from "../../../api/ownerApi";
import { getAllLocations } from "../../../api/locationApi";

const initialFormState = {
  title: "",
  description: "",
  propertyType: "apartment",
  price: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
  locationId: "",
};

export default function AddPropertyModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(initialFormState);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const res = await getAllLocations();
      setLocations(res.data.locations || []);
    } catch (err) {
      console.error("Failed to load locations", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await createProperty({
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
      });

      // ⏳ WAIT FOR LIST TO REFRESH
      if (onSuccess) {
        await onSuccess();
      }

      // RESET FORM
      setForm(initialFormState);

      // CLOSE MODAL AFTER SUCCESS
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Add Property
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-4 px-6 py-5">
          <input
            name="title"
            placeholder="Property Title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
          />

          <textarea
            name="description"
            placeholder="Property Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
          />

          <select
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
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
              placeholder="Price (₹)"
              value={form.price}
              onChange={handleChange}
              className="rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
            />
            <input
              name="area"
              type="number"
              placeholder="Area (sq ft)"
              value={form.area}
              onChange={handleChange}
              className="rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="bedrooms"
              type="number"
              placeholder="Bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
              className="rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
            />
            <input
              name="bathrooms"
              type="number"
              placeholder="Bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
              className="rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <select
            name="locationId"
            value={form.locationId}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 focus:border-purple-500 focus:outline-none"
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.city} - {loc.postalCode}
              </option>
            ))}
          </select>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="rounded bg-purple-600 px-5 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

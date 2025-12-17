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
  const [error, setError] = useState("");

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const res = await getAllLocations();
      setLocations(res.data?.locations || []);
    } catch (err) {
      console.error("Failed to load locations", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.title) return "Title is required";
    if (!form.price) return "Price is required";
    if (!form.locationId) return "Location is required";
    return "";
  };

  const handleSave = async () => {
    if (loading) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createProperty({
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
      });

      const createdProperty = res.data?.property;

      // 🔄 refresh list
      if (onSuccess) await onSuccess();

      // reset
      setForm(initialFormState);

      // close
      onClose();

      /**
       * 🔥 NEXT STEP:
       * createdProperty._id ko use karke
       * image upload modal / page open kar sakte ho
       */
      console.log("Created Property ID:", createdProperty?._id);
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Add Property</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="space-y-4 px-6 py-5">
          {error && (
            <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <input
            name="title"
            placeholder="Property Title *"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded border px-3 py-2"
          />

          <select
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="price"
              type="number"
              placeholder="Price (₹) *"
              value={form.price}
              onChange={handleChange}
              className="rounded border px-3 py-2"
            />
            <input
              name="area"
              type="number"
              placeholder="Area (sq ft)"
              value={form.area}
              onChange={handleChange}
              className="rounded border px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="bedrooms"
              type="number"
              placeholder="Bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
              className="rounded border px-3 py-2"
            />
            <input
              name="bathrooms"
              type="number"
              placeholder="Bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
              className="rounded border px-3 py-2"
            />
          </div>

          <select
            name="locationId"
            value={form.locationId}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Select Location *</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.city} - {loc.postalCode}
              </option>
            ))}
          </select>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button onClick={onClose} className="rounded bg-gray-200 px-4 py-2">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded bg-purple-600 px-5 py-2 text-white"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

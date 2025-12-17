import React from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PropertyImagesModal = ({ property, onClose }) => {
  if (!property) return null;

  const images = property.images || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-w-3xl w-full rounded-xl bg-white p-5 shadow">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {property.title} – Images
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {images.length === 0 ? (
          <p className="text-gray-500">No images uploaded</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <img
                key={img._id}
                src={`${API_BASE}${img.imageUrl}`}
                alt="property"
                className="h-32 w-full rounded object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyImagesModal;

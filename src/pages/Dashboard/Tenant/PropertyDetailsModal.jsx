import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";

const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function PropertyDetailsModal({
  property,
  onClose,
  onRemoveWishlist,
}) {
  const images = property.images || [];
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  const imageUrl = (id) =>
    `${API_BASE}/uploads/properties/${id}`;

  const next = () =>
    setIndex((i) => (i + 1) % images.length);
  const prev = () =>
    setIndex((i) =>
      i === 0 ? images.length - 1 : i - 1
    );

  return (
    <>
      {/* MODAL */}
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <div className="bg-white w-full max-w-4xl rounded-xl relative overflow-hidden">

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow"
          >
            <X size={18} />
          </button>

          {/* IMAGE SLIDER */}
          <div className="relative h-[380px] bg-black">
            <img
              src={imageUrl(images[index])}
              onClick={() => setZoom(true)}
              className="h-full w-full object-cover cursor-zoom-in"
              alt="Property"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-2 p-3 overflow-x-auto">
            {images.map((img, i) => (
              <img
                key={img}
                src={imageUrl(img)}
                onClick={() => setIndex(i)}
                className={`h-20 w-28 object-cover rounded cursor-pointer border-2 ${
                  i === index
                    ? "border-indigo-600"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>

          {/* DETAILS */}
          <div className="p-5 space-y-3">
            <h2 className="text-xl font-bold">
              {property.title}
            </h2>

            <p className="text-lg text-indigo-600 font-semibold">
              ₹{property.price}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Status: {property.status}
              </span>

              <button
                onClick={() => onRemoveWishlist(property._id)}
                className="flex items-center gap-2 text-red-600"
              >
                <Heart className="fill-red-500" size={18} />
                Remove Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN ZOOM */}
      {zoom && (
        <div
          className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
          onClick={() => setZoom(false)}
        >
          <img
            src={imageUrl(images[index])}
            className="max-h-full max-w-full object-contain"
            alt="Zoomed"
          />
        </div>
      )}
    </>
  );
}

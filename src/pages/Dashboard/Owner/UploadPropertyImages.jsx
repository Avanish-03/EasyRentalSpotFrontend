import React, { useState } from "react";
import { uploadPropertyImages } from "../../../api/ownerApi";

export default function UploadPropertyImages({ propertyId, onDone }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!files.length) {
      setError("Please select at least one image");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);
      setError("");
      await uploadPropertyImages(propertyId, formData);
      onDone();
    } catch (err) {
      setError("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ERROR */}
      {error && (
        <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* FILE INPUT */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleSelect}
        className="block w-full text-sm"
      />

      {/* PREVIEW */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden border"
            >
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="h-24 w-full object-cover"
              />

              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 rounded-full bg-black/70 px-2 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onDone}
          className="rounded bg-gray-200 px-4 py-2 text-sm"
        >
          Skip
        </button>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="rounded bg-purple-600 px-5 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload Images"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import axios from "axios";

export default function ImageUpload({ images, setImages, maxImages = 8 }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding new files would exceed the max limit
    if (images.length + files.length > maxImages) {
      alert(`You can only upload a maximum of ${maxImages} images`);
      return;
    }

    // Check file types and sizes
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds the 5MB size limit`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      // For each file, create a FormData and upload
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data.url;
      });

      // Wait for all uploads to complete
      const newImageUrls = await Promise.all(uploadPromises);

      // Add new images to the existing ones
      setImages([...images, ...newImageUrls]);
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
      // Clear the input
      e.target.value = "";
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "10px" }}>
        {/* Display existing images */}
        {images.map((image, index) => (
          <div key={index} style={{ position: "relative", border: "1px solid #ccc", borderRadius: "5px", overflow: "hidden" }}>
            <img src={image} alt={`Upload ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button
              type="button"
              onClick={() => removeImage(index)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                padding: "5px",
                cursor: "pointer",
              }}
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {/* Upload button (if under max limit) */}
        {images.length < maxImages && (
          <label
            style={{
              border: "2px dashed #ccc",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              aspectRatio: "1",
              padding: "10px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <Upload style={{ width: "32px", height: "32px", color: "#888", marginBottom: "5px" }} />
              <p style={{ fontSize: "12px", color: "#888" }}>Click to upload</p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>
        )}
      </div>

      {uploading && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <p style={{ color: "blue" }}>Uploading images...</p>
        </div>
      )}

      <p style={{ fontSize: "12px", color: "#888", marginTop: "10px" }}>
        {images.length} of {maxImages} images uploaded
      </p>
    </div>
  );
}
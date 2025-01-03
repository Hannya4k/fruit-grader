import React, { useState } from "react";
import styles from "../styles/pages/upload.module.scss";

const UploadPage = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null); // To store the image source for preview

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string); // Set the uploaded image as the source
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <div className={`${styles.upload} ${styles.fadeIn}`}>
      <div className={styles.title}>Upload a Photo</div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Display the uploaded image preview */}
        {imageSrc && (
          <div className={styles.imagePreview}>
            <img
              src={imageSrc}
              alt="Uploaded Preview"
              className={styles.previewImage}
            />
          </div>
        )}

        {/* File input for image upload */}
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          className={styles.fileInput}
        />

        {/* Button to trigger file input */}
        <label htmlFor="imageUpload" className={styles.uploadButton}>
          Choose Image
        </label>
      </div>
    </div>
  );
};

export default UploadPage;

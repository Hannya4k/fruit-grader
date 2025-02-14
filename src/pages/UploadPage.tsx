import React, { useState } from "react";
import axios from "axios";  // Import axios for making HTTP requests
import styles from "../styles/pages/upload.module.scss";

const UploadPage = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null); // To store the image source for preview
  const [results, setResults] = useState<any | null>(null); // To store the response data
  const [loading, setLoading] = useState(false); // To show loading indicator

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

  // Handle image submission
  const handleSubmit = async () => {
    if (!imageSrc) return; // Ensure image is uploaded before submitting

    const formData = new FormData();
    const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      formData.append("image", file);

      try {
        setLoading(true); // Start loading
        const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setResults(response.data.results); // Set the results from API response
        setImageSrc(`data:image/jpeg;base64,${response.data.image}`); // Set the base64 image as the source
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false); // Stop loading
      }
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
        <label htmlFor="imageUpload" className={styles.button}>
          Choose Image
        </label>
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit} className={styles.button}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </div>

      {results && (
        <div className={styles.results}>
          <h3>Results:</h3>
          {results.map((result: any, index: number) => (
            <div key={index} className={styles.resultItem}>
              <p>{`Label: ${result.yolo_label}`}</p>
              <p>{`Confidence: ${(result.confidence * 100).toFixed(2)}%`}</p>
              <p>{`Grade: ${result.vgg_grade}`}</p>
              <p>{`Grade: ${result.path}`}</p>
            </div>
          ))}
        </div>
      )}
      {results && (
        <div className={styles.results}>
          <h3>Results:</h3>
          {results.map((result: any, index: number) => (
            <div key={index} className={styles.resultItem}>
              <p>{`Label: ${result.efficientnet_label}`}</p>
              <p>{`Grade: ${result.efficientnet_grade}`}</p>
              <p>{`Grade: ${result.path}`}</p>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default UploadPage;

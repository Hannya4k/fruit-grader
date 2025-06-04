import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/pages/upload.module.scss";
import { Col, Row, Typography } from "antd";

const { Title } = Typography;

const UploadPage = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null); // To store the image source for preview
  // const [results, setResults] = useState<any | null>(null); // To store the response data
  const [loading, setLoading] = useState(false); // To show loading indicator
  const [baselineResults, setBaselineResults] = useState<any[]>([]);
  const [cbamResults, setCbamResults] = useState<any[]>([]);
  const [baseFeatureMaps, setBaseFeatureMaps] = useState<string | null>(null);
  const [cbamFeatureMaps, setCbamFeatureMaps] = useState<string | null>(null);
  const [inferenceTime, setInferenceTime] = useState<{ base_model: number; cbam_model: number } | null>(null);


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

  useEffect(() => {
    console.log("Updated baselineResults:", baselineResults);
  }, [baselineResults]);

  // Handle image submission
  const handleSubmit = async () => {
    if (!imageSrc) return; // Ensure image is uploaded before submitting
  
    const formData = new FormData();
    const fileInput = document.getElementById(
      "imageUpload"
    ) as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      formData.append("image", file);
  
      try {
        setLoading(true); // Start loading
        const response = await axios.post(
          "http://127.0.0.1:5000/predict",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Full response from API:", response.data);
        const results = response.data || {};
        setBaselineResults(
          results.base_net_prediction ? [results.base_net_prediction] : []
        );
        setCbamResults(
          results.cbam_net_prediction ? [results.cbam_net_prediction] : []
        );
        setInferenceTime(results.inference_time_sec || null);
  
        // Request feature maps from the backend
        const baseFeatureMapsResponse = await axios.post(
          "http://127.0.0.1:5000/feature-maps/base",
          formData,
          { responseType: "blob" } // To handle image response
        );
        const baseFeatureMapsUrl = URL.createObjectURL(baseFeatureMapsResponse.data);
        setBaseFeatureMaps(baseFeatureMapsUrl); // Save base feature maps URL
  
        const cbamFeatureMapsResponse = await axios.post(
          "http://127.0.0.1:5000/feature-maps/cbam",
          formData,
          { responseType: "blob" } // To handle image response
        );
        const cbamFeatureMapsUrl = URL.createObjectURL(cbamFeatureMapsResponse.data);
        setCbamFeatureMaps(cbamFeatureMapsUrl); // Save CBAM feature maps URL
  
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <div className={`${styles.upload} ${styles.fadeIn}`}>
      <Title>Upload a Photo</Title>
      <div className={styles.legend}>
        <h4>Legend: Confidence</h4>
        <ul>
          <li>
            <span style={{ color: "green", fontWeight: "bold" }}>
              High Confidence
            </span>
            : The model is highly certain (≥ 80%) about the predicted fruit
            quality.
          </li>
          <li>
            <span style={{ color: "orange", fontWeight: "bold" }}>
              Medium Confidence
            </span>
            : The model is moderately certain (50% - 79%) about the predicted
            fruit quality.
          </li>
          <li>
            <span style={{ color: "red", fontWeight: "bold" }}>
              Low Confidence
            </span>
            : The model is uncertain (&lt; 50%) about the predicted fruit
            quality.
          </li>
        </ul>
      </div>

      <Row gutter={16} style={{ width: "100%", marginTop: "20px" }}>
        <Col span={12}>
          <div className={styles.title} style={{ textAlign: "center" }}>
            BASELINE
          </div>
          <Row justify="center">
            {imageSrc && (
              <div className={styles.imagePreview}>
                <img
                  src={imageSrc}
                  alt="Uploaded Preview"
                  className={styles.previewImage}
                />
              </div>
            )}
          </Row>
          <Row justify="center">
            {baselineResults.length > 0 && (
              <div className={styles.results}>
                <h3>Results:</h3>
                {baselineResults.map((result: any, index: number) => (
                  <div key={index} className={styles.resultItem}>
                    {result.top3_fruits.map((fruitResult: any, fruitIndex: number) => (
                      <div key={fruitIndex}>
                        <p>{`Fruit Type: ${fruitResult.fruit}`}</p>
                        <p
                          style={{
                            color:
                              fruitResult.confidence >= 0.8
                                ? "green"
                                : fruitResult.confidence >= 0.5
                                ? "orange"
                                : "red",
                          }}
                        >{`Confidence: ${(fruitResult.confidence * 100).toFixed(2)}%`}</p>
                      </div>
                    ))}
                    <p>{`Quality: ${result.freshness}`}</p>
                    <p
                      style={{
                        color:
                          result.freshness_score >= 0.8
                            ? "green"
                            : result.freshness_score >= 0.5
                            ? "orange"
                            : "red",
                      }}
                    >{`Quality Confidence: ${(
                      result.freshness_score * 100
                    ).toFixed(2)}%`}</p>
                  </div>
                  // <div key={index} className={styles.resultItem}>
                  //   <p>{`Label: ${result.yolo_label}`}</p>
                  //   <p>{`Confidence: ${(result.confidence * 100).toFixed(
                  //     2
                  //   )}%`}</p>
                  //   <p>{`Grade: ${result.vgg_grade}`}</p>
                  //   <p>{`Grade: ${result.path}`}</p>
                  // </div>
                ))}
                {inferenceTime?.base_model !== undefined && (
                  <p style={{ fontStyle: "italic", color: "#888" }}>
                    Inference Time: {inferenceTime.base_model.toFixed(2)} seconds
                  </p>
                )}
              </div>
            )}

            {/* {results && (
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
              )} */}
          </Row>
          <Row justify="center">
            {baseFeatureMaps && (
              <div>
                <h3>Base Model Feature Maps:</h3>
                <img src={baseFeatureMaps} alt="Base Feature Maps" />
              </div>
            )}
          </Row>
        </Col>
        <Col span={12}>
          <div className={styles.title} style={{ textAlign: "center" }}>
            PROPOSED
          </div>
          <Row justify="center">
            {imageSrc && (
              <div className={styles.imagePreview}>
                <img
                  src={imageSrc}
                  alt="Uploaded Preview"
                  className={styles.previewImage}
                />
              </div>
            )}
          </Row>
          <Row justify="center">
            {cbamResults.length > 0 && (
              <div className={styles.results}>
                <h3>Results:</h3>
                {cbamResults.map((result: any, index: number) => (
                  <div key={index} className={styles.resultItem}>
                    {result.top3_fruits.map((fruitResult: any, fruitIndex: number) => (
                      <div key={fruitIndex}>
                        <p>{`Fruit Type: ${fruitResult.fruit}`}</p>
                        <p
                          style={{
                            color:
                              fruitResult.confidence >= 0.8
                                ? "green"
                                : fruitResult.confidence >= 0.5
                                ? "orange"
                                : "red",
                          }}
                        >{`Confidence: ${(fruitResult.confidence * 100).toFixed(2)}%`}</p>
                      </div>
                    ))}
                    <p>{`Quality: ${result.freshness}`}</p>
                    <p
                      style={{
                        color:
                          result.freshness_score >= 0.8
                            ? "green"
                            : result.freshness_score >= 0.5
                            ? "orange"
                            : "red",
                      }}
                    >{`Quality Confidence: ${(
                      result.freshness_score * 100
                    ).toFixed(2)}%`}</p>
                  </div>
                  // <div key={index} className={styles.resultItem}>
                  //   <p>{`Label: ${result.yolo_label}`}</p>
                  //   <p>{`Confidence: ${(result.confidence * 100).toFixed(
                  //     2
                  //   )}%`}</p>
                  //   <p>{`Grade: ${result.vgg_grade}`}</p>
                  //   <p>{`Grade: ${result.path}`}</p>
                  // </div>
                ))}
                {inferenceTime?.cbam_model !== undefined && (
                  <p style={{ fontStyle: "italic", color: "#888" }}>
                    Inference Time: {inferenceTime.cbam_model.toFixed(2)} seconds
                  </p>
                )}
              </div>
            )}
            {/* {results && (
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
            )} */}
          </Row>
          <Row justify="center">
            {cbamFeatureMaps && (
              <div>
                <h3>CBAM Model Feature Maps:</h3>
                <img src={cbamFeatureMaps} alt="CBAM Feature Maps" />
              </div>
            )}
          </Row>
        </Col>
      </Row>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Display the uploaded image preview */}
        {/* {imageSrc && (
          <div className={styles.imagePreview}>
            <img
              src={imageSrc}
              alt="Uploaded Preview"
              className={styles.previewImage}
            />
          </div>
        )} */}

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

      {/* {results && (
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
      )} */}
    </div>
  );
};

export default UploadPage;

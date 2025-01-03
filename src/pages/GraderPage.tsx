import { useRef, useState, useEffect } from "react";
import styles from "../styles/pages/grader.module.scss";
import ResultModal from "../components/modals/ResultModal";

const GraderPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Access the user's webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing the camera:", error);
        alert("Unable to access the camera. Please check your permissions.");
      });

    return () => {
      // Clean up the camera stream
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to an image
        const photoData = canvas.toDataURL("image/png");
        setPhoto(photoData); // Store the photo in state
        setIsModalOpen(true);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`${styles.grader} ${styles.fadeIn}`}>
      <video ref={videoRef} autoPlay className={styles.video}></video>

      <button onClick={capturePhoto} className={styles.button}>
        CAPTURE
      </button>

      {/* {photo && (
        <div>
          <h3>Result:</h3>
          <img
            src={photo}
            alt="Captured"
            style={{
              width: "100%",
              maxWidth: "600px",
              border: "2px solid #ccc",
              borderRadius: "10px",
            }}
          />
        </div>
      )} */}
      <div>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

        <ResultModal isOpen={isModalOpen} photo={photo} onClose={closeModal} />
      </div>
    </div>
  );
};

export default GraderPage;

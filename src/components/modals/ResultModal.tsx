import styles from "../../styles/components/result.module.scss";

interface ResultModalProps {
  isOpen: boolean;
  photo: string | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  photo,
  onClose,
}) => {
  if (!isOpen || !photo) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <span className={styles.closeModal} onClick={onClose}>
          &times; {/* Close Button */}
        </span>
        <div>
          <h3>Result</h3>
          <img src={photo} alt="Captured" className={styles.capture} />
        </div>
      </div>
    </div>
  );
};

export default ResultModal;

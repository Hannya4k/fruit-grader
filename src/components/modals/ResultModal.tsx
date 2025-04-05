import { Col, Row, Typography } from "antd";
import styles from "../../styles/components/result.module.scss";

const { Text } = Typography;
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
          <Row gutter={16}>
            <Col span={12}>
              <Text style={{ fontSize: "25px" }}>Baseline</Text>
              <img src={photo} alt="Captured" className={styles.capture} />
              {/* Add Result Here */}
            </Col>
            <Col span={12}>
              <Text style={{ fontSize: "25px" }}>Proposed</Text>
              <img src={photo} alt="Captured" className={styles.capture} />
              {/* Add Result here */}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;

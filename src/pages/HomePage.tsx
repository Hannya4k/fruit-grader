import { useState } from "react";
import { About } from "../data/About";
import styles from "../styles/pages/home.module.scss";
import hand from "../assets/hand.png";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleChoice1 = () => {
    navigate("/grader");
    setIsDropdownOpen(false);
  };

  const handleChoice2 = () => {
    navigate("/upload");
    setIsDropdownOpen(false);
  };

  return (
    <div className={`${styles.home} ${styles.fadeIn}`}>
      <div>
        <h1 className={styles.about}>{About.about1}</h1>
        <h4 className={styles.aboutNext}>{About.about2}</h4>
        <button className={styles.button} onClick={handleDropdown}>
          - Get Started -
        </button>
        {isDropdownOpen && (
          <div className={styles.dropdownContent}>
            <button onClick={handleChoice1}>Real Time Camera</button>
            <button onClick={handleChoice2}>Upload Photo</button>
          </div>
        )}
      </div>
      <div>
        <img src={hand} alt="Hand" className={styles.image} />
      </div>
    </div>
  );
};

export default HomePage;

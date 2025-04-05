import { Route, Routes } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CameraPage from "./pages/CameraPage";
import UploadPage from "./pages/UploadPage";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </>
  );
};

export default App;

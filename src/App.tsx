import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import GraderPage from "./pages/GraderPage";
import UploadPage from "./pages/UploadPage";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/grader" element={<GraderPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </>
  );
};

export default App;

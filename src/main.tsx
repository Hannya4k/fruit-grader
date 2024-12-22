// import "react-toastify/dist/ReactToastify.css";
import "./index.scss";

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { ToastContainer } from "react-toastify";

import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <App />
    {/* <ToastContainer /> */}
  </BrowserRouter>
);

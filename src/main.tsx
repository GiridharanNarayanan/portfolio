import { Buffer } from 'buffer';
// Polyfill Buffer for browser (required by gray-matter)
window.Buffer = Buffer;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
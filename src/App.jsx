import React from "react";
import { createRoot } from "react-dom/client";
import Shell from "./Shell";
import "./index.css";

const root = createRoot(document.getElementById("app"));
root.render(
  <React.StrictMode>
    <Shell />
  </React.StrictMode>
);

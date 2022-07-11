import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import "./style/index.css";

import App from "./App";
import Admin from "./routes/Admin";
import Dashboard from "./routes/Dashboard";
import Leaderboard from "./routes/Leaderboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CookiesProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="admin" element={<Admin />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </CookiesProvider>
);

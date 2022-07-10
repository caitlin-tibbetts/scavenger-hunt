import React from "react";
import ReactDOM from "react-dom/client";
import "./style/index.css";
import App from "./App";
import Admin from "./routes/Admin";
import Game from "./components/Game";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import GameDashboard from "./routes/GameDashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CookiesProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="admin" element={<Admin />} />
        <Route path="gameDash" element={<GameDashboard />} />
      </Routes>
    </BrowserRouter>
  </CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

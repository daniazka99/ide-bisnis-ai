/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import { BusinessIdea } from "./types";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [history, setHistory] = useState<BusinessIdea[]>(() => {
    const saved = localStorage.getItem("businessHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("businessHistory", JSON.stringify(history));
  }, [history]);

  const addToHistory = (ideas: BusinessIdea[]) => {
    setHistory(prev => {
      const newHistory = [...ideas, ...prev];
      return newHistory.slice(0, 10); // Keep last 10
    });
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={() => setIsAuthenticated(true)} />} 
        />
        
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Home onIdeasGenerated={addToHistory} />} />
          <Route path="/explore" element={<Explore onIdeasGenerated={addToHistory} />} />
          <Route path="/detail/:id" element={<Detail history={history} />} />
          <Route path="/profile" element={<Profile history={history} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}


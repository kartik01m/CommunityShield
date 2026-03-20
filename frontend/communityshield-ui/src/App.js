import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rescuer from './pages/Rescuer';
import EmergencyGuide from './pages/EmergencyGuide';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"        element={<Login />} />
        <Route path="/citizen" element={<Dashboard />} />
        <Route path="/rescuer" element={<Rescuer />} />
        <Route path="/guide"   element={<EmergencyGuide />} />
      </Routes>
    </Router>
  );
}

export default App;
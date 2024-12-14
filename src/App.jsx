import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Appointment from './pages/Appointment';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/appointment"
        element={
          <ProtectedRoute>
            <Appointment />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContextProvider, useAuth } from './context/AuthContext';
import './App.css';
//COMPONENTS
import Signin from './pages/signin';
import Home from './pages/Home';
import Navbar from './components/navbar';
//
import Task from './Task';
import Theme from './pages/theme';
import Calendars  from './pages/calendars';
import Analytics from './pages/analytics';

const App = () => {
  return (
    <AuthContextProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="content">
            <AppRoutes />
          </div>
        </div>
      </Router>
    </AuthContextProvider>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {!user && <Route path="/" element={<Signin />} />}
      {user && (
        <>
          <Route path="/Home" element={<Home />} />
          <Route path="/Task" element={<Task />} />
          <Route path="/Theme" element={<Theme />} />
          <Route path="/Calendars" element={<Calendars />} />
          <Route path="/Analytics" element={<Analytics />} />
        </>
      )}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to="/Home" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;

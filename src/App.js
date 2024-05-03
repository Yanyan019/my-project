import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {  useAuth } from './context/AuthContext';
import './App.css';
//
import Navbar from './components/navbar';
//COMPONENTS
import Signin from './pages/signin';
import Home from './pages/Home';
import Task from './pages/Task';
import Theme from './pages/theme';
import Calendars  from './pages/calendars';
import Analytics from './pages/analytics';
//THEME

 
const App = () => {
  const {user} = useAuth();

  return (
    <div className = "App">
        <Router>
        {user ? (
          <div className="app-container">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Task" element={<Task />} />
              <Route path="/Theme" element={<Theme />} />
              <Route path="/Calendars" element={<Calendars />} />
              <Route path="/Analytics" element={<Analytics />} />
              {/* Other routes */}
            </Routes>
          </div>
        ) : (
          <Signin />
        )}
      </Router>
    </div>
  );
};

export default App;

import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
//ICONS
import { LuLayoutDashboard } from "react-icons/lu";
import { GrTask } from "react-icons/gr";
import { IoCalendarOutline } from "react-icons/io5";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { IoIosLogOut } from "react-icons/io";
import { AiOutlineFormatPainter } from "react-icons/ai";
//LOGO


const Navbar = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logOut();
    navigate('/signin');
  };

  
 
  

  return (
    <div className="sidenav">
      <div className="flex flex-col overflow-hidden">
        <div className="flex items-center justify-center h-16 logo-container">
          <h1 className="text-logo">Taskify</h1>
        </div>
        <ul className="nav">
          <li>
            <Link to="/Home" activeClassName="active" className="nav-link">
              <span className="icon"><LuLayoutDashboard /></span>
              <span className="text-sm font-medium">Overview</span>
            </Link>
          </li>
          <li>
            <Link to="/Task" activeClassName="active" className="nav-link">
              <span className="icon"><GrTask /></span>
              <span className="text-sm font-medium">My Tasks</span>
            </Link>
          </li>
          <li>
            <Link to="/Theme" activeClassName="active" className="nav-link">
              <span className="icon"><AiOutlineFormatPainter /></span>
              <span className="text-sm font-medium">Theme</span>

            </Link>
          </li>
          <li>
            <Link to="/Calendars" activeClassName="active" className="nav-link">
              <span className="icon"><IoCalendarOutline /></span>
              <span className="text-sm font-medium">Calendar</span>
            </Link>
          </li>
          <li>
            <Link to="/Analytics" activeClassName="active" className="nav-link">
              <span className="icon"><TbBrandGoogleAnalytics /></span>
              <span className="text-sm font-medium">Analytics</span>
            </Link>
          </li>
          <li>
            <Link to="/" className="nav-link" onClick={handleLogout}>
              <span className="icon"><IoIosLogOut /></span>
              <span className="text-sm font-medium">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>      
  );
}

export default Navbar;

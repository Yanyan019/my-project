import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../context/AuthContext';
/* import { useNavigate } from 'react-router-dom'; */
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
  /* const navigate = useNavigate(); */

  const handleLogout = async () => {
    await logOut();
/*     navigate(''); */
  };


  return (
    <div className="sidenav">
        <div className='logo'>
          <h1>Taskify</h1>
        </div>
        <ul className='nav'>
          {/* OVERVIEW */}
          <li>
            <Link to='/Task' className='nav-link'>
            <span className='buton'><GrTask className='icon'/>My Task</span>
            </Link>
          </li>
          <li>
            <Link to='/Calendars' className='nav-link'>
            <span className='buton'><IoCalendarOutline className='icon'/>Calendar</span>
            </Link>
          </li>
          <li>
            <Link to='/Analytics' className='nav-link'>
            <span className='buton'><TbBrandGoogleAnalytics className='icon'/>Analytics</span>
            </Link>
          </li>
          <li>
            <Link to='/Theme' className='nav-link'>
            <span className='buton'><AiOutlineFormatPainter className='icon'/>Theme</span>
            </Link>
          </li>
          <li>
            <Link to='' className='nav-link' onClick={handleLogout}>
            <span className='buton'><IoIosLogOut className='icon'/>Logout</span>
            </Link>
          </li>
        </ul>
    </div>
      
  );
}

export default Navbar;

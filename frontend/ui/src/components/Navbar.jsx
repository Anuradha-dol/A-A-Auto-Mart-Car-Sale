import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


const SriLankaDateTime = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateOptions = { timeZone: 'Asia/Colombo', year: 'numeric', month: 'long', day: 'numeric' };
      const timeOptions = { timeZone: 'Asia/Colombo', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };

      setDate(now.toLocaleDateString('en-US', dateOptions));
      setTime(now.toLocaleTimeString('en-US', timeOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="navbar-date-time">
      📅 {date} &nbsp;&nbsp; ⏰ {time} (🇱🇰)
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [showLinks, setShowLinks] = useState(true); // New state for visibility

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY === 0) {
      // At top → hide links
      setShowLinks(true);
    } else {
      // Scrolled down → show links
      setShowLinks(false);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);


  const renderLink = (to, label) => (
    <li className="nav-item">
      <Link to={to} className="nav-link">{label}</Link>
    </li>
  );

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">🚗 AutoMart</div>
        {showLinks && (
          <ul className="navbar-nav">
            {/* Car / Vehicle Routes */}
            {(path === "/customer-dashboard" || path.startsWith("/customersidevehiclepart")|| path.startsWith("/empProfile")) && (
              <>
                {renderLink("/customer-dashboard", "🏠 Home")}
                {renderLink("/customersidevehiclepart", "🚘 Find Vehicle Parts")}
               
                {renderLink("/custProfile", "View Profile")}
                {renderLink("/MyVehiclePartRequestsform", "🚘 add req Vehicle Parts")}
                {renderLink("/VehiclePartRequestDashboard", "view req ")}
                {renderLink("/AllMechanicWorks", " find vehicle from garage")}
                {renderLink("/reviews", "📝 Reviews")}
                {renderLink("/support", "🛟 Support")}
               
              </>
            )}

          </ul>
        )}

        

        
      </div>

      <div className="navbar-right">
        <SriLankaDateTime />
      </div>
    </nav>
  );
};

export default Navbar;

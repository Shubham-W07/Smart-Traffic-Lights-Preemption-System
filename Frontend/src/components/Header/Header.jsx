import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";

import medical_star from "../../assets/medical_star.png";
import { MAIN } from "../../algorithm/main.js";

const Header = ({ isLoggedIN, setIsLoggedIN }) => {

  const navigate = useNavigate();
  console.log(`Is Driver LoggedIn : ${isLoggedIN}`);

  return (
    <div className='header'>

      <ul>
        <img src={medical_star} alt="Medical Start Icon" />

        {!isLoggedIN && (
          <>
            <li><NavLink to="/" className={({ isActive }) => (isActive ? "text-red-400" : "text-white")}>Home</NavLink></li>
          </>
        )}
        
      </ul>

      <ul>

        {!isLoggedIN && (
          <>
            <li><NavLink to="/login" className={({ isActive }) => (isActive ? "text-red-400" : "text-white")}>Login</NavLink></li>
          </>
        )}

        {isLoggedIN && (
          <li>
            <button id="btn-logout"
              onClick={() => {
                localStorage.removeItem("user");
                setIsLoggedIN(false);
                navigate("/login");
                MAIN(false);
              }}>
              Logout
            </button>
          </li>
        )}

      </ul>

    </div>
  );
};

export default Header;

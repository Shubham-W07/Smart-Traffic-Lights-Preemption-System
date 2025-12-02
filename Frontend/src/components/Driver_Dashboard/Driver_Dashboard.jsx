import { useState, useEffect, useRef } from "react";
import "./Driver_Dashboard.css";
import siren from "../../assets/siren.png";
import { MAIN } from "../../algorithm/main.js";

const Driver_Dashboard = () => {
  const [animate, setAnimate] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const blinkRef = useRef();

  const connectWebSocket = async () => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const token = user?.token;

    // Testing for Invalid token
    // const token = "eyJhbGciOiJIUzI1NiItInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjQ2NkU0MTIsImV4cCI6MTc2NDY4MjYxMn0.gpMN2VD2oy02SLTYcohx4deEuAIpX8UdeiyDS7xP1cQ";

    if (!token) {
      throw new Error("User not logged in");
    }

    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/user/algorithm`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
    });

    const result = await response.json();
    console.log(result);

    if (result.message === "Verified Successfully") {
      setAnimate(prev => !prev);
    }
    else {
      console.log(result.message);
    }

  };

  useEffect(() => {
    if (animate) {
      MAIN(true);
      blinkRef.current = setInterval(() => {
        setIsSmall((small) => !small);
      }, 500);
    }
    else {
      clearInterval(blinkRef.current);
      blinkRef.current = null;
      MAIN(false);
    }
  }, [animate]);

  return (
    <div className="container">

      <h1 className={"text-amber-200"}>{`${animate ? "Emmergency Activated!" : "Emmergency Deactivated!"}`}</h1>

      <div className={`box ${animate ? 'box-activated' : ''}`} onClick={connectWebSocket}>
        <img id="siren" className={isSmall ? "small" : ""} src={siren} alt={"Siren Icon"} />
      </div>

    </div>
  );
};

export default Driver_Dashboard;

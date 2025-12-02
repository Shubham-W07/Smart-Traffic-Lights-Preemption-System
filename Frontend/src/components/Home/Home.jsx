import "./Home.css";

import problem from "../../assets/problem.png";
import approach from "../../assets/approach.png";
import target from "../../assets/target.png";
import ambulance from "../../assets/ambulance.png";

const Home = () => {
  return (
    <>
      <div className="about-page-container">

        {/* 1. Header Section */}
        <header className="about-header">
          <div className="header-content">
            <div className="logo-circle">
              <span className="logo-icon"><img src={ambulance} alt="Ambulance Icon" /></span>
            </div>
            <h1>Smart Traffic Preemption System</h1>
            <p className="subtitle">
              A dynamic, IoT-based solution ensuring zero-delay transit for emergency vehicles through busy urban junctions.
            </p>
          </div>
        </header>

        {/* 2. Problem & Goal Section */}
        <section className="section section-problem-goal">
          <h2 className="section-title">Why This Project?</h2>
          <div className="problem-goal-grid">

            {/* Problem */}
            <div className="grid-box problem-box">
              <p className="box-icon"><img src={problem} alt="Critical Problem" /></p>
              <h3>The Critical Problem</h3>
              <p className="box-detail">
                Fixed signals don’t react to emergency vehicles, causing critical time loss at busy junctions, severely impacting patient outcomes.
              </p>
            </div>

            {/* Goal */}
            <div className="grid-box goal-box">
              <p className="box-icon"><img src={approach} alt="Critical Problem" /></p>
              <h3>Our Core Goal</h3>
              <p className="box-detail">
                To automatically prioritize ambulances by preempting traffic signals along their route using real-time GPS data.
              </p>
            </div>

            {/* Approach */}
            <div className="grid-box approach-box">
              <p className="box-icon"><img src={target} alt="Critical Problem" /></p>
              <h3>The Approach</h3>
              <p className="box-detail">
                Utilize GPS location, backend logic, and IoT-based signal control with MQTT and microcontrollers for reliable communication.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Detailed Objectives Section */}
        <section className="section section-details">
          <h2 className="section-title">Key Objectives</h2>
          <div className="details-content">
            <p className="intro-text">
              In growing urban areas, ambulances often get stuck at traffic junctions due to fixed-time signals
              and heavy congestion. This project focuses on dynamically controlling traffic lights based on
              the live position of an ambulance. When an ambulance approaches an intersection, the system
              gives it a green signal and holds other sides on red until it passes.
            </p>
            <ul className="objective-list">
              <li>Automatically switch the traffic signal to green along the ambulance route and to red on all intersecting paths.</li>
              <li>Ensure robust and reliable communication between the ambulance, backend server, and traffic signal units.</li>
              <li>Implement fault-tolerant logic that enables communication between the ambulance and signal units through the driver’s smartphone in case of server-unit communication failure.</li>
            </ul>
          </div>
        </section>

        {/* 4. System Highlights Section */}
        <section className="section section-highlights">
          <h2 className="section-title">System Highlights</h2>
          <div className="highlight-grid">

            <div className="highlight-box">
              <p className="highlight-title">Real-time Tracking</p>
              <p className="highlight-detail">
                The ambulance application continuously sends live GPS coordinates along with the current region name whenever the emergency mode is activated. This enables the backend system to monitor the vehicle’s distance, movement, and direction relative to nearby intersections.
              </p>
            </div>

            <div class="highlight-box">
              <p class="highlight-title">Intelligent Decision Logic</p>
              <p class="highlight-detail">
                Advanced distance thresholds and bearing-based calculations determine when the ambulance is approaching or leaving a junction, ensuring efficient and optimized traffic flow during emergency situations.
              </p>
            </div>

            <div class="highlight-box">
              <p class="highlight-title">IoT-based Signal Control</p>
              <p class="highlight-detail">
                MQTT-driven communication directly controls NodeMCU/ESP8266 units connected to Arduino-powered traffic signals, enabling fast, reliable, and real-time signal switching.
              </p>
            </div>

            <div class="highlight-box">
              <p class="highlight-title">Multi-role Web Application</p>
              <p class="highlight-detail">
                Separate interfaces for accident-site users to request an ambulance, as well as for hospitals and drivers, support secure registrations, approval workflows, and real-time monitoring of emergency response operations.
              </p>
            </div>

          </div>
        </section>

        {/* 5. Technologies & Outcomes Section */}
        <section className="section section-tech-outcomes">
          <div className="tech-outcomes-wrapper">

            <div className="tech-section">
              <h2 className="section-title-small">Technologies Used</h2>
              <div className="tech-grid">

                <div className="tech-box">
                  <p className="tech-title">Backend</p>
                  <p className="tech-detail">
                    Python (for high-performance NumPy vectorized computations), Node.js, WebSockets
                    (for persistent real-time communication during emergency mode), and optimized
                    distance & bearing calculation algorithms.
                  </p>
                </div>

                <div className="tech-box">
                  <p className="tech-title">Frontend</p>
                  <p className="tech-detail">
                    React.js with a responsive, mobile-friendly interface for seamless user experience.
                  </p>
                </div>

                <div className="tech-box">
                  <p className="tech-title">Communication</p>
                  <p className="tech-detail">
                    MQTT for server-to-IoT communication, and WebSockets for continuous,
                    low-latency interaction between the ambulance application and the backend.
                  </p>
                </div>

                <div className="tech-box">
                  <p className="tech-title">Hardware</p>
                  <p className="tech-detail">
                    NodeMCU ESP8266, Arduino Mega 2560, and an LED-based traffic signal prototype.
                  </p>
                </div>

              </div>
            </div>

            <div className="outcomes-section">
              <h2 className="section-title-small">Outcomes & Future Scope</h2>
              <p className="outcomes-text">
                Prototype testing demonstrated that the system can rapidly respond to ambulance movements,
                dramatically reducing waiting times at critical junctions. The architecture is scalable and
                can be extended to support fire trucks and police vehicles, and further integrated into
                smart-city command centers with advanced analytics and centralized traffic optimization.
              </p>
            </div>

          </div>
        </section>

      </div>
    </>
  );
};

export default Home;
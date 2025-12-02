# Smart Signal Preemption System For Emergency Services (Patent In Process)

This project implements an intelligent, automated system to prioritize the passage of emergency vehicles (ambulances) through urban intersections by dynamically controlling traffic signals based on real-time location and movement. The core goal is to minimize delay at traffic junctions, which is crucial for patient survival in critical situations.

---

## Core System Features and Objectives

The system ensures zero-delay transit by replacing fixed-timing signals with a dynamic, responsive IoT solution.

* **Real-Time Tracking:** The ambulance application continuously streams live GPS coordinates and the current region name when emergency mode is active.
* **Intelligent Preemption:** The system calculates the ambulance's distance and direction of travel relative to nearby signals to automatically trigger a green phase only on the approaching path.
* **Automated Signal Control:** The traffic signal in the vehicle's path is changed to green, and all intersecting paths are held on red until the ambulance has crossed the junction.
* **Fault Tolerance:** A fallback mechanism is implemented to allow the ambulance application (driver's smartphone) to publish signal commands directly to the MQTT broker if the server-to-broker communication fails.

---

## Technology Stack and Components

The architecture utilizes a combination of high-performance backend, real-time messaging, and lightweight IoT hardware.

### 1. Backend and Processing
| Category | Component | Description |
| :--- | :--- | :--- |
| **Server Operations** | **Node.js** | Used for managing the backend application and coordinating communication flow. |
| **Computation Engine** | **Python (with NumPy)** | Used for high-performance, vectorized calculation of the **Haversine Distance** and **Bearing Formula** to ensure low-latency preemption decisions. |
| **Database** | **MySQL** | Stores user authentication, ambulance records, trip logs, and traffic signal metadata. |

### 2. Frontend Interfaces
| Category | Component | Description |
| :--- | :--- | :--- |
| **Web Application** | **React.js** | Provides a responsive, mobile-friendly interface for the Ambulance Driver (GPS streaming and Emergency Activation) and the Hospital Admin Dashboard. |

### 3. Real-time Communication
| Protocol | Role | Description |
| :--- | :--- | :--- |
| **WebSockets** | Client-to-Server | Manages continuous, low-latency transmission of GPS coordinates from the ambulance client to the backend. |
| **MQTT** | Server-to-IoT | Lightweight publish/subscribe protocol used to deliver JSON-based preemption commands reliably to the signal control units. |

### 4. Hardware (Simulation Prototype)
| Component | Role | Description |
| :--- | :--- | :--- |
| **IoT Module** | **NodeMCU ESP8266** | Connects to the MQTT broker, receives priority commands, and forwards them to the Arduino via Serial Communication. |
| **Traffic Controller** | **Arduino Mega 2560** | Receives commands from the ESP8266 and controls the **LED-based traffic signal model** (representing Red, Yellow, Green lights) for physical demonstration. |

---

## Mathematical Model and Decision Logic

The core logic uses geometry to determine the precise moment and signal to preempt.

### 1. Distance Calculation (Haversine Formula)
Used to compute the real-world distance between the ambulance's current GPS coordinates $(\phi_1, \lambda_1)$ and each traffic signal $(\phi_2, \lambda_2)$.

$$
a=sin^{2}(\frac{\Delta\phi}{2})+cos(\phi_{1})cos(\phi_{2})sin^{2}(\frac{\Delta\lambda}{2})
$$
$$
c=2\cdot \arcsin(\sqrt{a})
$$
$$
\text{Distance} (\text{km})=R\cdot c \quad (R=6371\text{ km})
$$

### 2. Bearing (Direction) Formula
Calculates the angle $(0^\circ-360^\circ)$ of the ambulance's movement path, which is converted to a compass direction (NORTH, EAST, SOUTH, WEST) to ensure the correct signal road is prioritized.

### 3. Preemption Logic
Priority is given only when three conditions are met:
* The ambulance is moving closer to the signal (**distance decreasing**).
* Its direction **matches** the signal's road direction.
* Its distance is within the **activation limit** (e.g., $0.5\text{ km}$).

---

## Main Algorithm Flow

The server-side logic follows an event-driven flow to process location updates and publish commands.



1.  **Initialize:** Start the server, connect the MQTT client, and load signal data for the current region into memory (caching).
2.  **Receive:** Wait for and receive coordinates (lat, lon, region) from the ambulance via WebSocket.
3.  **Compute:** Calculate distance and bearing to the nearest signal. Determine the movement trend (approaching/leaving).
4.  **Trigger:**
    * If **approaching** (distance decreasing $\leq 0.5\text{ km}$), send `"approaching"` JSON via MQTT.
    * If **leaving** (distance increasing $> 0.1\text{ km}$), send `"leaving"` JSON via MQTT to revert the signal.
5.  **Loop:** Update state and wait for the next coordinate event.

---

## Results and Future Scope

The project successfully created a functional prototype that demonstrated instantaneous signal response (average delay of 1 to 3 seconds) to ambulance movement, proving the system's reliability in reducing intersection delays.


* **Future Scope:** Expanding the system to include mobile applications for all stakeholders, integrating advanced route prediction logic, supporting centralized fleet management, and coordinating multi-node traffic networks for a continuous green corridor.


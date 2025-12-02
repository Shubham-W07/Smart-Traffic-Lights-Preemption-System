# Smart Traffic Management Backend Setup Guide (Windows)

This guide provides step-by-step instructions for setting up and running the hybrid backend components (Python Engine and Node.js Server) of the Smart Traffic Preemption System on a Windows operating system.

---

## Prerequisites

You must have the following software installed on your Windows machine:

1.  **Node.js & npm:** (Includes Node Package Manager)
2.  **Python 3:** (Make sure to check the "Add Python to PATH" option during installation)
3.  **MySQL Server & Client:** (e.g., MySQL Community Server and MySQL Workbench/CLI)

---

## 1. Python Computation Engine Setup

The Python environment is dedicated to running the high-performance **NumPy-vectorized calculation** for Haversine distance and bearing.

1.  **Navigate to the Python Engine Directory:**
    ```bash
    cd ./Backend/python_engine
    ```

2.  **Create a Virtual Environment:**
    ```bash
    python -m venv venv
    ```

3.  **Activate the Virtual Environment (PowerShell):**
    ```bash
    ./venv/Script/Activate.ps1
    ```
    *(If using Command Prompt/CMD, use: `.\venv\Scripts\activate`)*

4.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Start the Python Engine:**
    *(You must keep this window/process running for the Node.js server to use the computational logic.)*
    ```bash
    python main.py 
    ```
    *(Note: The exact Python startup command might be `python main.py` or similar, adjust if necessary.)*

---

## 2. Node.js Server Setup

The Node.js server handles the main business logic, WebSocket connections, API routing, and MQTT communication.

1.  **Navigate to the Node Server Directory:**
    ```bash
    cd ./Backend/node_server
    ```

2.  **Install Node Dependencies:**
    ```bash
    npm i
    ```

3.  **Start the Node Server:**
    *(This is the main application server, running on the API_PORT defined in your `.env` file.)*
    ```bash
    node ./server.js
    ```

---

## 3. MySQL Database Setup

You need a running MySQL instance and the required tables populated with initial signal data.

### 3.1. Database and Table Creation

Execute the following SQL commands in your MySQL client (e.g., MySQL Workbench or Command Line Interface):

```sql
CREATE DATABASE IF NOT EXISTS BTECH_PROJECT;
USE BTECH_PROJECT;

-- Table for user authentication (Ambulance Drivers, Admins)
CREATE TABLE ambulance_driver_auth (
  id INT AUTO_INCREMENT PRIMARY KEY,
  driver_name VARCHAR(100) NOT NULL,
  driver_email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Table for storing traffic signal locations
CREATE TABLE traffic_signals (
  signal_topic VARCHAR(100),
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  region VARCHAR(100)
);

-- Initial Data Insertion for Pune region signals
INSERT INTO traffic_signals (signal_topic, latitude, longitude, region) VALUES
('s101', 18.4575, 73.8915, 'Pune'),
('s102', 18.5075, 73.9415, 'Pune'),
('s103', 18.4070, 73.8410, 'Pune'),
('s104', 18.4675, 73.9515, 'Pune'),
('s105', 18.3970, 73.8310, 'Pune');
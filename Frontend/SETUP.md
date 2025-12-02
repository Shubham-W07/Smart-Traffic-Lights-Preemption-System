# Smart Traffic Preemption Frontend Setup Guide (React Application)

This guide provides step-by-step instructions for setting up and running the **React.js Frontend Application** on a Windows operating system. This application provides the Ambulance Driver and Hospital Admin interfaces.

---

## Prerequisites

You must have the following software installed:

1.  **Node.js & npm:** (Includes Node Package Manager, required for running React and installing dependencies)
2.  **The Backend Services must be running:** Ensure your Python Computation Engine and Node.js Server are both active and accessible on your local network/machine, as described in the previous backend guide.

---

## 1. Frontend Installation and Setup

1.  **Navigate to the Frontend Directory:**
    Open your terminal (Command Prompt, PowerShell, or Git Bash) and change the directory to the frontend project folder.

    ```bash
    cd ./Frontend
    ```

2.  **Install Node Dependencies:**
    Install all required packages listed in `package.json`.

    ```bash
    npm i
    ```

3.  **Configure the Network Environment (`.env`)**

    You must create or edit the **`.env`** file in the root of the `./Frontend` directory. This file tells the React application where to find the running Node.js API and WebSocket server.

    Replace `NETWORK_IP` with the actual **IP address** of the machine hosting your backend services (e.g., `192.168.1.100` or `localhost`).

    | Variable | Description |
    | :--- | :--- |
    | `VITE_API_URL` | The URL for the main HTTP API calls (e.g., login, registration). Use the `API_PORT` (e.g., 3000) configured in your Node server's `.env`. |
    | `VITE_WS_URL` | The URL for the real-time WebSocket connection (used for GPS streaming). Use the `WS_PORT` (e.g., 5000) configured in your Node server's `.env`. |

    **Example `.env` Content (Update IP and Ports if necessary):**

    ```
    VITE_API_URL=http://localhost:3000
    VITE_WS_URL=ws://localhost:5000
    ```
    *If your backend server is on another computer, replace `localhost` with that computer's IP address.*

---

## 2. Running the Application

1.  **Start the React Development Server:**
    Execute the command to start the application. This will usually open the app in your default web browser (e.g., at `http://localhost:5173` or a similar port).

    ```bash
    npm run dev
    ```

2.  **Access the Application:**
    The application is now running and ready to be used as the **Ambulance Driver Interface** to stream coordinates and activate the emergency preemption system.

---
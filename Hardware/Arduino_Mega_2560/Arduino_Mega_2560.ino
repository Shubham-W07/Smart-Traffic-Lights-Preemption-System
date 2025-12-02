// ---------- Arduino Mega 2560 Final Code ----------
// Connect NodeMCU TX -> Mega RX1 (pin 19)
// Baud rate: 9600 both sides

#include <Arduino.h>

// ------------------- Traffic Light Pin Mapping -------------------
// EAST direction
int Er = 22;   // East Red
int Ey = 23;   // East Yellow
int Eg = 24;   // East Green

// WEST direction
int Wr = 25;   // West Red
int Wy = 26;   // West Yellow
int Wg = 27;   // West Green

// NORTH direction
int Nr = 28;   // North Red 
int Ny = 29;   // North Yellow
int Ng = 30;   // North Green

// SOUTH direction
int Sr = 31;   // South Red
int Sy = 32;   // South Yellow
int Sg = 33;   // South Green

// Arrays for easy looping
int redPins[]    = {Er, Wr, Nr, Sr};
int yellowPins[] = {Ey, Wy, Ny, Sy};
int greenPins[]  = {Eg, Wg, Ng, Sg};

// ------------------- Data Handling -------------------
String activeDirection = "";  // Direction of emergency vehicle
bool emergencyActive = false; // Emergency mode flag
bool isVehicleApproching = false;
bool isVehicleLeaving = true;

// ------------------- Setup -------------------
void setup() {
  Serial.begin(9600);   // Debug logs
  Serial1.begin(9600);  // Data input from NodeMCU

  Serial.println("Arduino Mega ready. Waiting for data from NodeMCU...");

  // Initialize all pins as outputs and turn off all lights
  for (int i = 22; i <= 33; i++) {
    pinMode(i, OUTPUT);
    digitalWrite(i, LOW);
  }
}

// ------------------- Helper Functions -------------------

// Turn OFF all lights
void allLightsOff() {
  for (int i = 0; i < 4; i++) {
    digitalWrite(redPins[i], LOW);
    digitalWrite(yellowPins[i], LOW);
    digitalWrite(greenPins[i], LOW);
  }
}

// Turn ON/OFF all yellow lights
void setAllYellow(bool state) {
  for (int i = 0; i < 4; i++) {
    digitalWrite(yellowPins[i], state ? HIGH : LOW);
  }
}

// Blink ALL yellow lights 3 times (used for transition signal)
void blinkAllYellowLights() {
  allLightsOff();
  for (int i = 0; i < 3; i++) {
    setAllYellow(HIGH);
    delay(500);
    setAllYellow(LOW);
    delay(500);
  }
  allLightsOff();
}

// ----------------------------------------------------------
// ------------------- Parse Incoming Data -------------------
// ----------------------------------------------------------
// Expected input: "signal_topic":"s101","distKM":0.1476648903935067,"direction":"EAST"
// ----------------------------------------------------------
void parseData(String line) {
  line.trim();

  String signal_topic = "";
  String direction = "";
  String state = "";
  double distKM = 0.0;

  // --- Extract signal_topic ---
  int start = line.indexOf("\"signal_topic\":\"");
  if (start != -1) {
    start += 16;
    int end = line.indexOf("\"", start);
    signal_topic = line.substring(start, end);
  }

  // --- Extract distKM ---
  start = line.indexOf("\"distKM\":");
  if (start != -1) {
    start += 9;
    int end = line.indexOf(",", start);
    if (end == -1) end = line.length();
    String distStr = line.substring(start, end);
    distKM = distStr.toDouble();
  }

  // --- Extract direction ---
  start = line.indexOf("\"direction\":\"");
  if (start != -1) {
    start += 13;
    int end = line.indexOf("\"", start);
    direction = line.substring(start, end);
  }

  // --- Extract state ---
  start = line.indexOf("\"state\":\"");
  if (start != -1) {
    start += 9;
    int end = line.indexOf("\"", start);
    state = line.substring(start, end);
  }

  // ✅ Debugging output
  Serial.println("Parsed Data:");
  Serial.println("Signal Topic: " + signal_topic);
  Serial.println("Distance (km): " + String(distKM, 6));
  Serial.println("Direction: " + direction);
  Serial.println("State: " + state);

  static String previousDirection = "";

  // --- Direction changed (new vehicle or new approach) ---
  if (direction != previousDirection && previousDirection != "") {
    Serial.println("Direction changed! Resetting emergency.");
    emergencyActive = false;
    isVehicleApproching = false;
    isVehicleLeaving = true;
    allLightsOff();
    delay(500);
  }

  previousDirection = direction;
  activeDirection = direction;

  // Blink yellow lights when new message received
  blinkAllYellowLights();

  // ---------------------------------------------------
  // --- State-based Emergency Logic ---
  // ---------------------------------------------------
  if (state == "approching") {
    emergencyActive = true;
    isVehicleApproching = true;
    isVehicleLeaving = false;
    Serial.println("Vehicle Approaching (" + direction + ") - Emergency ON");
  } 
  else if (state == "leaving") {
    emergencyActive = false;
    isVehicleApproching = false;
    isVehicleLeaving = true;
    Serial.println("Vehicle Leaving (" + direction + ") - Emergency OFF");
  } 
  else {
    // Unrecognized or idle state
    Serial.println("Unknown state or idle.");
  }
}

// ----------------------------------------------------------
// ------------------- Normal Traffic Cycle -------------------
void normalSignaling() {
  static int dir = 0;    
  static int t = 0;      
  static unsigned long lastUpdate = 0;

  if (millis() - lastUpdate >= 1000) {
    lastUpdate = millis();
    t++;

    int nextDir = (dir + 1) % 4;

    for (int i = 0; i < 4; i++) {
      if (i == dir && t <= 40) {
        digitalWrite(greenPins[i], HIGH);
        digitalWrite(yellowPins[i], LOW);
        digitalWrite(redPins[i], LOW);
      } 
      else if ((i == dir || i == nextDir) && t > 40 && t <= 43) {
        digitalWrite(greenPins[i], LOW);
        digitalWrite(yellowPins[i], HIGH);
        digitalWrite(redPins[i], LOW);
      } 
      else if (i == nextDir && t > 43) {
        digitalWrite(greenPins[i], HIGH);
        digitalWrite(yellowPins[i], LOW);
        digitalWrite(redPins[i], LOW);
      } 
      else {
        digitalWrite(greenPins[i], LOW);
        digitalWrite(yellowPins[i], LOW);
        digitalWrite(redPins[i], HIGH);
      }
    }

    if (t >= 45) {
      t = 0;
      dir = nextDir;
    }
  }
}

// ----------------------------------------------------------
// ------------------- Emergency Mode -------------------
void emergencyControl() {
  for (int i = 0; i < 4; i++) {
    bool active = false;
    if (activeDirection == "EAST"  && redPins[i] == Er) active = true;
    if (activeDirection == "WEST"  && redPins[i] == Wr) active = true;
    if (activeDirection == "NORTH" && redPins[i] == Nr) active = true;
    if (activeDirection == "SOUTH" && redPins[i] == Sr) active = true;

    if (active) {
      digitalWrite(redPins[i], LOW);
      digitalWrite(yellowPins[i], LOW);
      digitalWrite(greenPins[i], HIGH);
    } else {
      digitalWrite(redPins[i], HIGH);
      digitalWrite(yellowPins[i], LOW);
      digitalWrite(greenPins[i], LOW);
    }
  }
}

// ----------------------------------------------------------
// ------------------- Main Loop -------------------
void loop() {
  // Read data from NodeMCU
  while (Serial1.available()) {
    String line = Serial1.readStringUntil('\n');
    line.trim();
    if (line.length() > 0) {
      parseData(line);
    }
  }

  // Run emergency or normal mode
  if (emergencyActive) {
    emergencyControl();
  } else {
    normalSignaling();
  }
}

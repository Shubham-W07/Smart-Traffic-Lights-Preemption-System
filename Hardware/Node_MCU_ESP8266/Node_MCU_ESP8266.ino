#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <EEPROM.h>

#include <SoftwareSerial.h>
SoftwareSerial megaSerial(D5, D6); // D5=TX, D6=RX (adjust pins as needed)

#define EEPROM_SIZE 512
#define WIFI_SSID_ADDR 0
#define WIFI_PASS_ADDR 100
#define TOPIC_ADDR 200

String ssid = "";
String password = "";
String signal_topic = "";
String topic = "";

const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);
ESP8266WebServer server(80);

const int ledPin = D2;

// ---------------- EEPROM ----------------
void saveStringToEEPROM(int addr, String value) {
  int len = value.length();
  if (len > 100) len = 100;
  for (int i = 0; i < len; i++) EEPROM.write(addr + i, value[i]);
  EEPROM.write(addr + len, '\0');
  EEPROM.commit();
}

String loadStringFromEEPROM(int addr) {
  char buf[101];
  for (int i = 0; i < 100; i++) {
    buf[i] = EEPROM.read(addr + i);
    if (buf[i] == '\0') break;
  }
  return String(buf);
}

// ---------------- MQTT ----------------
void callback(char* topic_c, byte* payload, unsigned int length) {
  // Convert raw MQTT payload into a string
  String msg;
  for (int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }

  // Remove curly brackets if present
  msg.trim();
  if (msg.startsWith("{")) msg.remove(0, 1);          // Remove first '{'
  if (msg.endsWith("}")) msg.remove(msg.length() - 1); // Remove last '}'

  // Print clean message to Serial Monitor
  Serial.println("Clean Message: " + msg);

  // Send clean message to Arduino
  megaSerial.println(msg);
}



void reconnect() {
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("NodeMCU_Signal")) {
      Serial.println("Connected");
      if (topic != "") client.subscribe(topic.c_str());
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 2s");
      delay(2000);
    }
  }
}

// ---------------- Web server ----------------
void handleRoot() {
  String html = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'>";
  html += "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
  html += "<title>NodeMCU Setup</title>";
  html += "<style>";

  // Base styles
  html += "body {font-family: 'Roboto', sans-serif; background-color: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px;}";
  html += ".material-form-container {background-color: #ffffff; padding: 40px 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 100%; max-width: 400px; box-sizing: border-box; transition: padding 0.3s ease;}";
  html += ".material-form {display: flex; flex-direction: column;}";
  html += ".material-input-group {position: relative; margin-bottom: 25px;}";
  html += ".material-input {width: 100%; padding: 12px 0; border: none; border-bottom: 1px solid #ccc; outline: none; font-size: 16px; color: #333; background-color: transparent; transition: border-bottom-color 0.3s ease;}";
  html += ".material-input:focus {border-bottom-color: #6200ee;}";
  html += ".material-input-bar {position: absolute; bottom: 0; left: 0; height: 2px; width: 100%; background-color: #6200ee; transform: scaleX(0); transition: transform 0.3s ease;}";
  html += ".material-input:focus ~ .material-input-bar {transform: scaleX(1);}";
  html += ".material-label {position: absolute; top: 12px; left: 0; font-size: 16px; color: #999; pointer-events: none; transition: all 0.3s ease;}";
  html += ".material-input:focus ~ .material-label, .material-input:not(:placeholder-shown).material-input:valid ~ .material-label {top: -18px; font-size: 12px; color: #6200ee;}";

  // Button styles
  html += ".material-button {background-color: #6200ee; color: white; padding: 14px 0; border: none; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer; outline: none; position: relative; overflow: hidden; transform: translateZ(0); box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: background-color 0.3s ease, box-shadow 0.3s ease; margin-top: 15px;}";
  html += ".material-button:hover {background-color: #5300d6; box-shadow: 0 4px 8px rgba(0,0,0,0.2);}";
  html += ".material-button:active {background-color: #4500bb;}";

  // Responsive styles
  html += "@media (max-width: 430px) { .material-form-container { padding: 30px 20px; } .material-input { font-size: 14px; padding: 10px 0; } .material-label { font-size: 14px; } .material-button { font-size: 15px; padding: 12px 0; } }";

  html += "</style></head><body>";

  html += "<div class='material-form-container'>";
  html += "<form class='material-form' action='/setConfig' method='POST' novalidate>";

  // SSID input
  html += "<div class='material-input-group'>";
  html += "<input type='text' id='ssid' name='ssid' class='material-input' value='" + ssid + "' required placeholder=' '>";
  html += "<label for='ssid' class='material-label'>WiFi SSID</label>";
  html += "<div class='material-input-bar'></div></div>";

  // Password input
  html += "<div class='material-input-group'>";
  html += "<input type='password' id='password' name='password' class='material-input' value='" + password + "' required placeholder=' '>";
  html += "<label for='password' class='material-label'>WiFi Password</label>";
  html += "<div class='material-input-bar'></div></div>";

  // Signal topic input
  html += "<div class='material-input-group'>";
  html += "<input type='text' id='topic' name='topic' class='material-input' value='" + signal_topic + "' required placeholder=' '>";
  html += "<label for='topic' class='material-label'>Signal Topic</label>";
  html += "<div class='material-input-bar'></div></div>";

  html += "<button type='submit' class='material-button'>Save</button>";
  html += "</form></div></body></html>";

  server.send(200, "text/html", html);
}

void handleSetConfig() {
  if (server.hasArg("ssid") && server.hasArg("password") && server.hasArg("topic")) {
    ssid = server.arg("ssid");
    password = server.arg("password");
    signal_topic = server.arg("topic");
    topic = "traffic/" + signal_topic;

    saveStringToEEPROM(WIFI_SSID_ADDR, ssid);
    saveStringToEEPROM(WIFI_PASS_ADDR, password);
    saveStringToEEPROM(TOPIC_ADDR, signal_topic);

    Serial.println("Configuration saved!");

    // Green tick popup HTML
    String html = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'>";
    html += "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
    html += "<title>Saved</title>";
    html += "<style>";
    html += "body{display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f5f5;}";
    html += ".popup{display:flex;flex-direction:column;align-items:center;background:#fff;padding:40px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);}";
    html += ".tick{width:80px;height:80px;border-radius:50%;background:#4CAF50;display:flex;justify-content:center;align-items:center;margin-bottom:20px;}";
    html += ".tick:after{content:'✓';color:#fff;font-size:48px;font-weight:bold;}";
    html += "</style></head><body>";
    html += "<div class='popup'><div class='tick'></div><h2>Saved Successfully!</h2></div>";
    html += "<script>setTimeout(()=>{window.location='/';},2000);</script>";
    html += "</body></html>";

    server.send(200, "text/html", html);
    delay(2000);
    ESP.restart();
  } else {
    server.send(400, "text/plain", "Missing fields!");
  }
}

// ---------------- Setup ----------------
void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  EEPROM.begin(EEPROM_SIZE);
  ssid = loadStringFromEEPROM(WIFI_SSID_ADDR);
  password = loadStringFromEEPROM(WIFI_PASS_ADDR);
  signal_topic = loadStringFromEEPROM(TOPIC_ADDR);
  if (signal_topic != "") topic = "traffic/" + signal_topic;

  Serial.println("Loaded WiFi SSID: " + ssid);
  Serial.println("Loaded Signal Topic: " + signal_topic);

  if (ssid != "") {
    WiFi.begin(ssid.c_str(), password.c_str());
    Serial.print("Connecting to WiFi");
    int retry = 0;
    while (WiFi.status() != WL_CONNECTED && retry < 20) {
      delay(500);
      Serial.print(".");
      retry++;
    }
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected: " + WiFi.localIP().toString());
  } else {
    Serial.println("\nWiFi failed → starting AP mode");
    WiFi.softAP("NodeMCU_Setup", "12345678");
    Serial.println("AP IP: " + WiFi.softAPIP().toString());
  }

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  server.on("/", handleRoot);
  server.on("/setConfig", HTTP_POST, handleSetConfig);
  server.begin();
  Serial.println("Web server started");
}

// ---------------- Loop ----------------
void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    if (!client.connected()) reconnect();
    client.loop();
  }
  server.handleClient();
}

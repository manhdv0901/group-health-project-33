#include "MAX30100_PulseOximeter.h"
#include<Wire.h>
//import esp
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
//import temp
//#include <Adafruit_MLX90614.h>
//import dht11
#include <DHT.h>;
#define DHTPIN D5 // Chân dữ liệu của DHT11 kết nối với GPIO4 của ESP8266
#define DHTTYPE DHT11 // Loại DHT được sử dụng
DHT dht(DHTPIN, DHTTYPE);


//Adafruit_MLX90614 mlx = Adafruit_MLX90614();

WiFiClient wifiClient;
HTTPClient http;

//heart
#define REPORTING_PERIOD_MS 1500
PulseOximeter pox;

int newHeart, newSpo2, temp;

uint32_t tsLastReport = 0;
void onBeatDetected()
{
  Serial.println("Beat!");

}


//user && pass wifi
const char* ssid = "mất kết nối";
const char* password = "ADMIN@@@";

//func connect wifi
void connectWifi() {
  Serial.println("Connecting");
  // Thiết lập ESP8266 là Station và kết nối đến Wifi. in ra dấu `.` trên terminal nếu chưa được kết nối
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }
  Serial.println("\r\nWiFi connected");
  connectMax30100();
  dht.begin();
}

//fun connect max30100
void connectMax30100() {
  Serial.print("Initializing pulse oximeter..");
  if (!pox.begin())
  {
    Serial.println("FAILED");
    for (;;)
      ;
  }
  else
  {
    Serial.println("SUCCESS");
  }
  pox.setOnBeatDetectedCallback(onBeatDetected);

}


void sendRequest(float newHeart, float newSpo2, float temp) {
  
  //  if (WiFi.status() == WL_CONNECTED) {
  //      String url = "https://web-test-3010.herokuapp.com/add-device?heart=" + String(heart) + "&spO2=" + String(spO2);
  String url = "http://683f-118-71-152-232.ngrok.io/add-device?heart=" + String(newHeart) + "&spO2=" + String(newSpo2) + "&temp=" + String(temp);
  http.begin(wifiClient, url);
//    http.addHeader("Content-Type", "text/plain");
  http.addHeader("Content-Type","application/x-www-form-urlencoded");

  int httpResponseCode = http.POST(url);
  if (httpResponseCode == 200) {
    Serial.println("Send data sensor to server\n");
    String respose = http.getString();
    Serial.print("httpResponseCode: ");
    Serial.println(httpResponseCode);

    Serial.print("respose: ");
    Serial.println(respose);
  } else {
    Serial.println("Can't send data sensor to sever\n");
    Serial.print("httpResponseCode: ");
    Serial.println(httpResponseCode);
  }
  http.end();
  //  }
}


void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  connectWifi();
}

void loop() {
  //  delay(5000);

  //  int newHeart = heart.toInt();
  //  int newSpo2 = spO2.toInt();
  //stringstream str2num(heart);
 
  pox.update();
   newHeart = pox.getHeartRate();
    newSpo2 = pox.getSpO2();
    temp = dht.readTemperature();
  if (millis() - tsLastReport > REPORTING_PERIOD_MS)
  {
   
    Serial.print("Heart rate:");
    Serial.println(newHeart);
    Serial.print("SpO2:");
    Serial.print(newSpo2);
    Serial.println(" %");
    Serial.print("Temperature:");
    Serial.print(temp);
    Serial.println(" *C");

    Serial.println("-------------------------------------");
    tsLastReport = millis();
  }

  sendRequest(newHeart, newSpo2, temp);

}
//
//void temp() {
//  float t = dht.readTemperature();
//  Serial.print("Nhiêt do: ");
//  Serial.print(t);
//  Serial.println(" *C");
//}
//
//void heart() {
//  pox.update();
//  float h = pox.getHeartRate();
//  if (millis() - tsLastReport > REPORTING_PERIOD_MS)
//  {
//    Serial.print("Heart rate:");
//    Serial.print(h);
//    Serial.println(" nhịp/phút");
//    tsLastReport = millis();
//  }
//}
//void spO2() {
//  pox.update();
//  float s = pox.getSpO2();
//  if (millis() - tsLastReport > REPORTING_PERIOD_MS)
//  {
//    Serial.print("SpO2:");
//    Serial.print(s);
//    Serial.println(" %");
//    tsLastReport = millis();
//  }
//}

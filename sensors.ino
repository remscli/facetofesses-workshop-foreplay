
// Pins where sensors are connected
int pins[1] = {0};

// Keys matches pins number
long rMin[1] = {99999};
long rMax[1] = {0};
long rReference[1] = {};
bool initFinished[1] = {false};

// Tolerance in percentage for touch detection
int touchTolerance = 40;
int pressureTolerance = 90;

// Input voltage : 5V
int Vin = 5;

// Output voltage : 0V
float Vout = 0;

// Pull resistance in ohms
float pullDownResistance = 1000;

// Initialisation time in milliseconds
int initialisationTime = 5000;

float buffer = 0;

void setup()
{
  Serial.begin(9600);
  Serial.println("\n INIT");
}

void loop()
{
  // For each sensors
  int pin = 0;
  int r = calculateResistance(pin);
  
  if (r == false) return;

  if (millis() < initialisationTime) {
    // Update maximum resistance value if needed
    if (r > rMax[pin])
    {
      rMax[pin] = r;
    }

    // Update minimum resistance value if needed
    if (r < rMin[pin])
    {
      rMin[pin] = r;
    }
  } else {
    Serial.println("r : " + String(r));
      
    // If not initialized, set resistance reference as the middle of min and max
    if (!initFinished[pin])
    {
      rReference[pin] = rMin[pin] + (rMax[pin] - rMin[pin]) / 2;
      initFinished[pin] = true;
      Serial.println("rReference : " + String(rReference[pin]));
      Serial.println("READY");
    }

    // Check if resistance is outside of tolerance scope, meaning that the sensor is touched
    if (isLowerThan(r, rReference[pin], touchTolerance))
    {
      if (isLowerThan(r, rReference[pin], pressureTolerance))
      {
        Serial.println("PRESSED");
      } else {
        Serial.println("TOUCHED");
      }
    }
  }
}

bool isLowerThan(long value, long reference, int percentage)
{
  return value < reference * (1.0 - 1.0 * percentage / 100.0);
}

long calculateResistance(int pin)
{
  long raw = analogRead(pin);
  if (!raw) return false;
  buffer = raw * Vin;
  Vout = (buffer) / 1024;
  buffer = (Vin / Vout) - 1;
  return pullDownResistance * buffer;
}


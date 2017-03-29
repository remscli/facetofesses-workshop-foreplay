#include <CapacitiveSensor.h>

#define NB_OF_SENSORS 3
#define SEND_PIN 2

CapacitiveSensor sensors[NB_OF_SENSORS] = {
  CapacitiveSensor(SEND_PIN, 4),
  CapacitiveSensor(SEND_PIN, 7),
  CapacitiveSensor(SEND_PIN, 8)
};

void setup()
{
  /*for (int i = 0; i < sizeof(sensors); i++) {
    sensors[i].set_CS_AutocaL_Millis(0xFFFFFFFF);     // turn off autocalibrate on channel 1 - just as an example
  }*/
  Serial.begin(9600);
}

void loop()                    
{
  long start = millis();

  for (int i = 0; i < NB_OF_SENSORS; i++) {
    long value =  sensors[i].capacitiveSensor(30);
    Serial.print("Sensor ");
    Serial.print(i);
    
    if (isTouched(value)) {
      Serial.print(" touched !");
    } else {
      Serial.print("          ");
    }
    
    Serial.print("\t");
  }

  Serial.println("");

  delay(10);                                        // arbitrary delay to limit data to serial port 
}

bool isTouched(long value)
{
  return value > 100;
}

bool isStimulated(long value)
{
  return value > 100;
}

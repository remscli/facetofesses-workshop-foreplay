# Face to Fesses' foreplay workshop

Developed for [Face to Fesses project](http://www.facetofesses.fr/)

## Features

- Multiple Arduino boards support
- Add new erogenous zones with ease in `server/config.json`
- Browserify build for front-end js assets
- Using CapacitiveSensor Arduino library
- All logic is handled by the node.js server thanks to Johnny-five

## Physical setup

![Cabling](http://playground.arduino.cc/uploads/Main/CapSense.gif)

- Use only the digital pins
- Send pin : 2
- Sensors receive pins : 4, 7, 8, 12 and 13
- Wire all receive pins, even if unused. 

More informations about cabling here : http://playground.arduino.cc/Main/CapacitiveSensor?from=Main.CapSense


## Install instructions

Once the physical setup is done, connect the Arduino board and upload the sketch (`.ino` file) to it.

Start node.js server, johnny five server and start browserify watching : 
```
$ cd server
$ npm install
$ npm run start
```
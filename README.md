### Keyboard and Mouse Simulation
* I want control my parent's computer via the internet so I can reinstall the OS for them. 
* They do not have an IPMI-enabled motherboard, so I need to create a keyboard-mouse-over-ip device for them.
* I coupled a Seeed Studio Xiao (SAMD21) to a Raspberry Pi Zero Wireless (Pi ZW). 
  <br/><img src="misc/pi_xiao.jpg" style="height:300px; width:320px"></img>
  * My parents' PC will power the couple through a cable connected to Xiao and Pi will be powered through the 5V Pin.
  * The Xiao will emulate an HID Keyboard and an HID Mouse. 
  * The Pi ZW will receive command from my TCP server and forward it to Xiao via I2C. 
* Currently, I have finished to run a websocket service on Pi ZW and use Keyboard.html for remote control  
* Find Keyboard Map @ ~/Arduino/libraries/Keyboard/src/Keyboard.h 
* Find Mouse    Map @ ~/Arduino/libraries/Mouse/src/Mouse.h 
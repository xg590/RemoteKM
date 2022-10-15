### Keyboard and Mouse Simulation
* I want control my parent's computer via the internet so I can reinstall the OS for them. 
* They do not have an IPMI-enabled motherboard, so I need to create a keyboard-mouse-over-ip device for them.
* I coupled a Seeed Studio Xiao (SAMD21) to a Raspberry Pi Zero Wireless (Pi ZW). 
  * My parents' PC will power the couple through a cable connected to Xiao and Pi is powered through the 5V Pin.
  * The Xiao emulates an HID Keyboard and an HID Mouse. 
  * A broadcasting server is establised to forward the keystroke from a web browser to the Pi. 
  * A keyboard webpage feeds the broadcasting server with the keystroke.
  * The Pi ZW receives the keystroke and sends it to Xiao via I2C.
### Pics
* Keyboard Emulator (Pi-Xiao Couple)</br>
<img src="misc/pi_xiao.jpg" style="height:300px; width:320px"></img></br>
* Virtual Keyboard</br>
<img src="misc/keyboard.jpg" style="height:200px; width:800px"></img></br> 
### Misc
* Find Keyboard Map @ ~/Arduino/libraries/Keyboard/src/Keyboard.h 
* Find Mouse    Map @ ~/Arduino/libraries/Mouse/src/Mouse.h 
### Intro
* I want control my parent's computer via the internet so I can re-install MS Windows for them.
* They do not have an IPMI-enabled motherboard, so I need to make a remotely controlled gadget that emulates the keyboard and mouse.
* I have tested this gadget and used it in a Linux OS installation.
* I also used it to control my Android phone.
### The Gadget 
<table>
  <tr>
    <th style="width:350px">The couple of Seeed Studio Xiao (SAMD21) and </br>Raspberry Pi Zero Wireless (Pi ZW) couple.</th>
    <th>My parents' PC will power the couple.</th> 
  </tr>
  <tr>
    <td><img src="misc/upside_down_pi_xiao.jpg" style="height:140px; width:320px"></img></td>
    <td><img src="misc/pi_xiao.jpg" style="height:300px; width:320px"></img></td> 
  </tr>
  <tr>
    <th colspan=2>The couple is controlled via a virtual keyboard webpage.</th> 
  </tr>
  <tr>
    <td colspan=2><img src="misc/keyboard.jpg" style="height:150px; width:780px"></img></td> 
  </tr> 
</table>

### Features
* Hardware-based, no need to install software on a remote machine.
* Can be used to install operating system.
* Control the remote machine from a web browser.
* Communication is SSL encrypted and basic authentication is required.
### Mechanism
* My parents' PC powers the couple through a cable connected to Xiao (Pi is powered by Xiao through the 5V Pin).
* I control the Pi through a virtual keyboard webpage, Pi controls the Xiao via I2C protocol, and Xiao emulates an HID combo of keyboard and mouse.
* A websocket server is establised to broadcast keystrokes collected from the web browser (one websocket client) to the Pi (another websocket client).
### Usage
* Wire the Xiao to Pi and flash [remoteKM.ino](remoteKM.ino) to Xiao.
```
arduino-cli core update-index               --additional-urls https://files.seeedstudio.com/arduino/package_seeeduino_boards_index.json
arduino-cli core install seeeduino:samd     --additional-urls https://files.seeedstudio.com/arduino/package_seeeduino_boards_index.json
arduino-cli lib install Keyboard
arduino-cli lib install Mouse
mkdir remoteKM ; cd remoteKM
wget wget https://raw.githubusercontent.com/xg590/remoteKM/v2.1/remoteKM.ino
arduino-cli compile . --fqbn   Seeeduino:samd:seeed_XIAO_m0 && arduino-cli upload . --fqbn   Seeeduino:samd:seeed_XIAO_m0 -p /dev/ttyACM0
```
* Run [server.py](server.py) on server (Don't forget <i>Let's Encrypt</i>), run [real_keyboard.py](real_keyboard.py) on Pi, and open the [virtual_keyboard.html](virtual_keyboard.html) in any web browser.
```
wget https://raw.githubusercontent.com/xg590/remoteKM/v2.1/server.py
python3 server.py
wget https://raw.githubusercontent.com/xg590/remoteKM/v2.1/real_keyboard.py
python3 real_keyboard.py
wget https://raw.githubusercontent.com/xg590/remoteKM/v2.1/virtual_keyboard.html
```
### Misc
* Find Keyboard Map @ ~/Arduino/libraries/Keyboard/src/[Keyboard.h](misc/Keyboard.h)
* Find Mouse    Map @ ~/Arduino/libraries/Mouse/src/[Mouse.h](misc/Mouse.h)
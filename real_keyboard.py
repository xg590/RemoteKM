# pip install smbus2 websockets

import ssl
import json
import asyncio
import threading
import websockets
from smbus2 import SMBus, i2c_msg

bus = SMBus(1)
#bus.close()

async def main():
    username = "hello"
    password = "iloveyou"
    hostname = "guoxiaokang.com"
    #hostname = "192.168.12.238"
    async for websocket in websockets.connect(f"wss://{username}:{password}@{hostname}:8765"):
    #async for websocket in websockets.connect(f"ws://{username}:{password}@{hostname}:8765"):
        try:
            device_id = 0
            await websocket.send(json.dumps({"msg_type":"ready","device_type":"real_keyboard"}))
            async for msg in websocket:
                msg = json.loads(msg)
                if "msg_type" in msg:
                    if msg["msg_type"] == "init":
                        device_id = msg['device_id']
                    elif msg["msg_type"] == "alert":
                        pass
                    print(msg)
                elif "device_type" in msg:
                    if msg["device_type"] == "virtual_keyboard":
                        val   = msg["value"]
                        val_t = msg["value_type"]
                        ks_t  = msg["keystroke_type"][0]
                        if val_t == "string":
                            val = ord(val)
                        else:
                            val = int(val)
                        bus.i2c_rdwr(i2c_msg.write(0x34, [ord('k'), ord(ks_t), val, 0, 255])) # bytes must be in range [0, 256)

                    elif msg["device_type"] == "virtual_mouse":
                        kt = msg["key_type"]
                        me = msg["mouse_event"]
                        if me == "mousemove":
                            bus.i2c_rdwr(i2c_msg.write(0x34, [ord('m'), ord('m'), msg["dx"], msg["dy"], msg["dz"]]))
                        elif me=="click":
                            bus.i2c_rdwr(i2c_msg.write(0x34, [ord('m'), ord('c'), msg["value"], 128, 128])) # bytes must be in range [0, 256)
                        elif me=="mousedown":
                            bus.i2c_rdwr(i2c_msg.write(0x34, [ord('m'), ord('p'), msg["value"], 128, 128]))
                        elif me=="mouseup":
                            bus.i2c_rdwr(i2c_msg.write(0x34, [ord('m'), ord('r'), msg["value"], 128, 128]))
                        else:
                            print("???")
                    print(msg)
                else:
                    print("????", msg)
        except websockets.ConnectionClosed:
            print("Connection to the server is closed")
            continue

def foo(): asyncio.run(main())
#threading.Thread(target=foo).start()
foo()
import ssl
import json
import asyncio
import logging
import websockets
import threading

ws_conns = set()

def DEVICE_ID_GEN():
    i = 0
    while 1:
        i += 1
        yield i
device_id_gen = DEVICE_ID_GEN()

async def broadcast_handler(ws_conn):
    global ws_conns
    try:
        client_type = ""
        ws_conns.add(ws_conn)
        device_id = next(device_id_gen)
        await ws_conn.send(json.dumps({"msg_type": "init", "msg": "Welcome~", "device_id": device_id}))
        async for msg_str in ws_conn:
            print(msg_str)
            msg_json = json.loads(msg_str)
            if "msg_type" in msg_json and msg_json["msg_type"]=="ready":
                client_type = msg_json["device_type"]
                if client_type == "virtual_keyboard":
                    msg_json = {"msg_type":"reset_real_keyboard"}
                else:
                    msg_json = {"msg_type":"alert", "device_id": device_id, "msg":f"A new {client_type} is online"}
                websockets.broadcast(ws_conns, json.dumps(msg_json))
            else:
                websockets.broadcast(ws_conns, msg_str)

    except websockets.ConnectionClosed:
        pass # This prevents the "connection handler failed" exception
    finally:
        print(f"Broadcast: A {client_type} is offline")
        websockets.broadcast(ws_conns, json.dumps({"alert": f"A {client_type} is offline~"}))
        ws_conns.remove(ws_conn)

async def main():
    server_cert = 'fullchain.pem'  # secret of my apache and flask site
    server_key  = 'privkey.pem'    # secret of my apache and flask site
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_context.load_cert_chain(certfile=server_cert, keyfile=server_key)
    bapf = websockets.basic_auth_protocol_factory(
        realm="my dev server",
        credentials=("hello", "iloveyou"),
    )
    async with websockets.serve(broadcast_handler,
                                host="0.0.0.0",
                                port=8765,
                                create_protocol=bapf,
                                ssl=ssl_context): #
        await asyncio.Future()  # run forever

def foo(): asyncio.run(main())
#threading.Thread(target=foo).start()
foo()
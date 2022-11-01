var mouseKeyId=null, mouseKeyValue=0, originalX=0, originalY=0, dx=0, dy=0, reportMouseEventTimerId=0, reportMouseEvent='', reportMouseEventInterval=75;

document.getElementById("mouse-key-right").addEventListener("click", (evt)=>{
    document.getElementById("mouse-key-left" ).style.display = "none";
    document.getElementById("mouse-key-middle").style.display = "none";
    setTimeout(()=>{
        document.getElementById("mouse-key-left" ).style.display = "initial";
        document.getElementById("mouse-key-middle").style.display = "initial";
    }, 100);
    socket.send(JSON.stringify({
        "device_type" : "virtual_mouse"  ,
        "device_id"   : device_id        ,
        "key_type"    : "mouse-key-right",
        "value"       : 2                ,
        "mouse_event" : "click"          ,
    }));

      socket.send(JSON.stringify({
            "device_type"    : "virtual_keyboard",
            "value"          : "78",
            "value_type"     : "int",
            "keystroke_type" : "xxx"
        }));
});

function xyz_modifier(x) {
    x = x + 128;
    if (x>255) {
        return 255
    } else if (x<0) {
        return 0
    } else {
        return Math.floor(x)
    }
}

function draggingMouseXY (evt) {
    dx = evt.clientX-originalX,
    dy = evt.clientY-originalY;
    document.getElementById(mouseKeyId).transform.baseVal.getItem(0).setTranslate(dx,dy);
    reportMouseEvent = JSON.stringify({
        "device_type": "virtual_mouse",
        "device_id"  : device_id      ,
        "key_type"   : mouseKeyId,
        "mouse_event": "mousemove",
        "dx": xyz_modifier(dx), "dy": xyz_modifier(dy), "dz": 128,
    });
    if (reportMouseEventTimerId==0) {
        reportMouseEventTimerId = setInterval(()=>{socket.send(reportMouseEvent);}, reportMouseEventInterval);
    }
}

document.getElementById("mouse-key-left").addEventListener("mousedown", (evt)=>{
    mouseKeyId=evt.target.id;
    originalX = evt.clientX;
    originalY = evt.clientY;
    document.getElementById(mouseKeyId).addEventListener('mousemove' , draggingMouseXY);
    document.getElementById(mouseKeyId).addEventListener("mouseleave", mouseRestoreEveryThing);
    document.getElementById(mouseKeyId).addEventListener("mouseup"   , mouseRestoreEveryThing);
    document.getElementById("mouse-key-middle").style.display = "none";
    document.getElementById("mouse-key-right" ).style.display = "none";

    console.log(JSON.stringify({
        "device_type" : "virtual_mouse"  ,
        "device_id"   : device_id        ,
        "key_type"    : "mouse-key-left",
        "value"       : 1                ,
        "mouse_event" : "click"          ,
    }));
});

document.getElementById("mouse-itself").addEventListener("mousedown", (evt)=>{
    mouseKeyId="mouse-as-whole";
    originalX = evt.clientX;
    originalY = evt.clientY;
    document.getElementById("mouse-itself").addEventListener('mousemove', draggingMouseXY);
    document.getElementById("mouse-itself").addEventListener("mouseleave", mouseRestoreEveryThing);
    document.getElementById("mouse-itself").addEventListener("mouseup", mouseRestoreEveryThing);
    socket.send(JSON.stringify({
        "device_type": "virtual_mouse",
        "key_type"   : mouseKeyId     ,
        "mouse_event": "mousedown"    ,
        "value"      : 1              ,
    }));
});

function draggingMouseZ (evt) {
    dy = evt.clientY-originalY;
    evt.target.transform.baseVal.getItem(0).setTranslate(0, dy);
    reportMouseEvent = JSON.stringify({
        "device_type": "virtual_mouse",
        "key_type": mouseKeyId,
        "mouse_event":"mousemove",
        "dx": 128, "dy": 128, "dz": xyz_modifier(dy),
    }) ;
    if (reportMouseEventTimerId==0) {
        reportMouseEventTimerId = setInterval(()=>{socket.send(reportMouseEvent);}, reportMouseEventInterval);
    }
}

document.getElementById("mouse-key-middle").addEventListener("mousedown", (evt)=>{
    mouseKeyId = evt.target.id;
    originalY  = evt.clientY;
    document.getElementById(mouseKeyId).addEventListener('mousemove' , draggingMouseZ);
    document.getElementById(mouseKeyId).addEventListener("mouseleave", mouseRestoreEveryThing);
    document.getElementById(mouseKeyId).addEventListener("mouseup"   , mouseRestoreEveryThing);
    document.getElementById("mouse-key-left" ).style.display = "none";
    document.getElementById("mouse-key-right").style.display = "none";
    socket.send(JSON.stringify({
        "device_type": "virtual_mouse",
        "device_id"  : device_id      ,
        "key_type"   : mouseKeyId,
        "mouse_event": "mousedown",
        "value"      : 4         ,
    }));
});

function mouseRestoreEveryThing() {
    console.log(reportMouseEventTimerId);
    document.getElementById("mouse-key-left"  ).style.display = "initial";
    document.getElementById("mouse-key-middle").style.display = "initial";
    document.getElementById("mouse-key-right" ).style.display = "initial";
    clearInterval(reportMouseEventTimerId);
    dx=0, dy=0, reportMouseEventTimerId=0;
    var value=0;
    if (mouseKeyId=="mouse-key-left") {
        document.getElementById(mouseKeyId).removeEventListener('mousemove' , draggingMouseXY);
        document.getElementById(mouseKeyId).removeEventListener("mouseleave", mouseRestoreEveryThing);
        document.getElementById(mouseKeyId).removeEventListener("mouseup"   , mouseRestoreEveryThing);
        document.getElementById(mouseKeyId).transform.baseVal.getItem(0).setTranslate(0,0);
        mouseKeyId = null;
        return ;
    } else if (mouseKeyId=="mouse-key-middle") {
        document.getElementById(mouseKeyId).removeEventListener("mousemove" , draggingMouseZ);
        document.getElementById(mouseKeyId).removeEventListener("mouseleave", mouseRestoreEveryThing);
        document.getElementById(mouseKeyId).removeEventListener("mouseup"   , mouseRestoreEveryThing);
        value=4;
    } else if (mouseKeyId=="mouse-as-whole") {
        document.getElementById("mouse-itself").removeEventListener('mousemove', draggingMouseXY);
        document.getElementById("mouse-itself").removeEventListener("mouseleave", mouseRestoreEveryThing);
        document.getElementById("mouse-itself").removeEventListener("mouseup", mouseRestoreEveryThing);
        value=1;
    }
    document.getElementById(mouseKeyId).transform.baseVal.getItem(0).setTranslate(0,0);
    socket.send(JSON.stringify({
        "device_type" : "virtual_mouse",
        "device_id"   : device_id      ,
        "key_type"    : mouseKeyId     ,
        "mouse_event" : "mouseup"      ,
        "value"       : value          ,
    }));
    mouseKeyId = null;
}
// if (evt.touches) { evt = evt.touches[0]; }
//addEventListener('touchstart', startDrag);
//addEventListener('touchmove', drag);
//addEventListener('touchend', endDrag);
//addEventListener('touchleave', endDrag);
//addEventListener('touchcancel', endDrag);

var case_lock=false, shift_lock=false;

function function_caps_key() {
    document.querySelectorAll('.letter-display').forEach(ele => {
        if (case_lock) {
            ele.innerHTML = ele.innerHTML.toLowerCase();
        } else {
            ele.innerHTML = ele.innerHTML.toUpperCase();
        }
    });
    case_lock = !case_lock;
};

//encodeURIComponent(String.fromCharCode(code))
function func_shift_key() {
    function_caps_key();
    document.querySelectorAll('.shift-display-grey,.shift-display-white').forEach(ele => {
        if (ele.className == "shift-display-grey") {
            ele.className = "shift-display-white";
        } else {
            ele.className = "shift-display-grey";
        }
    }); 
}

var username = "hello";
var password = "iloveyou";
var hostname = "guoxiaokang.com";
//var hostname = "192.168.12.238";
//let socket = new WebSocket("ws://"+username+":"+password+"@"+hostname+":8765"); // ws://guoxiaokang:8765
let socket = new WebSocket("wss://"+username+":"+password+"@"+hostname+":8765"); // ws://guoxiaokang:8765
socket.onopen = function(e) {
    socket.send(JSON.stringify({
        "msg_type"   : "ready",
        "device_type": "virtual_keyboard",
    }));
};
socket.onclose = function(event) {
  if (event.wasClean) {
    //alert(`[ws closed] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down event.code is usually 1006 in this case
    //alert('[ws closed] Connection died');
  }
};
socket.onerror = function(error) {
  //alert(`[error] ${error.message}`);
};
var msg, device_id=0;
socket.onmessage = function(event) {
    msg = JSON.parse(event.data);
    if (msg["msg_type"]=="init") {
        device_id = msg["device_id"] ;
        //alert(msg["msg"]);
        // console.log("[Init]", msg["device_id"])
    } else if (msg["msg_type"]=="alert") {
        if (device_id == msg["device_id"]) {
            ; // console.log("[alert]", event.data)
        } else {
            console.log("[Alert]", event.data)
            //alert(msg["msg"]);
        }
    } else {
        console.log("[Broadcast]", event.data, device_id)
    }

};
document.querySelectorAll('.key').forEach(ele => {
    ele.addEventListener("click", ()=> {
        //console.log(ele.firstElementChild.className);//
        var keystroke_type = "write";
        switch(ele.id) {
            case "key-num-lock":
                if (ele.firstElementChild.className == "num-lock-void") {
                    ele.firstElementChild.className = "num-lock-box";
                } else {
                    ele.firstElementChild.className = "num-lock-void";
                }
                break;
            case "key-shift-left":
                func_shift_key();
            case "key-alt-left"  :
            case "key-ctrl-left" :
                if (ele.firstElementChild.className == "align-left-margin") {
                    ele.firstElementChild.className = "align-left-margin-box";
                    keystroke_type = "press";
                } else {
                    ele.firstElementChild.className = "align-left-margin";
                    keystroke_type = "release";
                }
                break;
            case "key-caps-lock" :
                function_caps_key();
                if (ele.firstElementChild.className == "align-left-margin") {
                    ele.firstElementChild.className = "align-left-margin-box";
                } else {
                    ele.firstElementChild.className = "align-left-margin";
                }
                break;
            case "key-shift-right":
                func_shift_key();
            case "key-alt-right"  :
            case "key-ctrl-right" :
                if (ele.firstElementChild.className == "align-right-margin") {
                    ele.firstElementChild.className = "align-right-margin-box";
                    keystroke_type = "press";
                } else {
                    ele.firstElementChild.className = "align-right-margin";
                    keystroke_type = "release";
                }
                break;
            default:
                ;// code block
        }
        console.log(ele.getAttribute("value"), ele.getAttribute("value_type"));
        socket.send(JSON.stringify({
            "device_type"    : "virtual_keyboard",
            "value"          : ele.getAttribute("value"),
            "value_type"     : ele.getAttribute("value_type"),
            "keystroke_type" : keystroke_type
        }));
    });
}); 
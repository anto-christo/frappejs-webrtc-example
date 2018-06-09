const WebRTC = require('frappejs/webrtc/webrtc');
var webRTC = new WebRTC();

var socket = io();
window.socket = socket;

var message = document.getElementById("message");
var sendBtn = document.getElementById("send");

var id = prompt("Enter Name of Room:");
webRTC.initConnection(id);

sendBtn.onclick = function(){
    var text = message.value;
    webRTC.sendData(text);
}

webRTC.onDataReceive = data => console.log(data);
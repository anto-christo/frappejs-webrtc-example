const WebRTC = require('frappejs/webrtc/webrtc');
var webRTC = new WebRTC();

var socket = io();
window.socket = socket;

var message = document.getElementById("message");
var sendBtn = document.getElementById("send");
var messageList = document.getElementById("messageList");

var id = prompt("Enter Name of Room:");
webRTC.initConnection(id);

sendBtn.onclick = function(){
    var text = message.value;
    webRTC.sendData(text);
    var div = document.createElement("div");
    div.setAttribute("style","border:0.5px solid grey; margin:1%; padding:1%");
    var data = document.createTextNode("You : "+text);
    div.appendChild(data);
    messageList.appendChild(div);
}

webRTC.onDataReceive = data => {
    var div = document.createElement("div");
    div.setAttribute("style","border:0.5px solid grey; margin:1%; padding:1%");
    var data = document.createTextNode("Sender : "+data);
    div.appendChild(data);
    messageList.appendChild(div);
};
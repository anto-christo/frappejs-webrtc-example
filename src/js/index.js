const WebRTC = require('frappejs/webrtc/webrtc');
var webRTC = new WebRTC();

var socket = io();
window.socket = socket;

$('#chat').hide();

$('#createBtn').on('click',function(){
    var room = $('#createRoomName').val();
    webRTC.initConnection(room);
    $('#createModal').modal('toggle');
    $('#console').hide();
    $('#chat').show();
});

$('#joinBtn').on('click',function(){
    var room = $('#joinRoomName').val();
    webRTC.initConnection(room);
    $('#joinModal').modal('toggle');
    $('#console').hide();
    $('#chat').show();
});

$('#sendBtn').on('click',function(){
    var message = $('#message').val();

    $('#chat').append(`<div class="row">
                        <div class="col-sm-4">
                        </div>

                        <div class="col-sm-4">
                            <div class="card">
                                <div class="card-body">
                                    You:${message}
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                        </div>
                    </div>`);

    webRTC.sendData(message);

    $('#message').val('');

});

webRTC.onDataReceive = message =>{
    $('#chat').append(`<div class="row">
                        <div class="col-sm-4">
                        </div>

                        <div class="col-sm-4">
                            <div class="card">
                                <div class="card-body">
                                    Client:${message}
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                        </div>
                    </div>`);
};
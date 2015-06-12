// socket.io init
var socket = io();

var click = ('ontouchstart' in document.documentElement)  ? 'touchstart' : 'mousedown';
$(document).on(click,function(e) {
    socket.emit("flap");
});

socket.on('id',function(id){$("body").css("background-color",id.id);});

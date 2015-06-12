/* Imports */

var express      = require('express');
var net          = require('net');
var session      = require('express-session');
var cookieParser = require('cookie-parser');
var app          = express();
var http         = require('http').Server(app);
var io           = require('socket.io')(http);

/* Local socket */
var host="localhost";
var port=2012;

var client = new net.Socket();

client.connect(port, host, function() {
    console.log("connected to " + host + ":"+port);
});

/* Main part */

app.set('views', '/home/alex/Projects/multiflap/server/views');
app.set('view engine', 'jade');

app.locals.pretty = true;

/* Response */
app.get(/^\/[^\.]*$/, function(req,res) {
    var segs = req.url.split("/");
    var lastseg = segs[segs.length-1];
    var r = lastseg ? lastseg.split(",") : [];
    res.render('index', {rooms:r});
});

io.on('connection', function(socket) {
    socket.emit('id', {"id":col(socket.id)});

    socket.on('disconnect', function(s) {
    });

    socket.on('flap', function(ref, time) {
        console.log(socket.id);
        client.write(socket.id+"\n");
    });
});

function col(id) {
    var c = "#";
    var t = (id.charCodeAt(0)+id.charCodeAt(1))%27;
    c += t%3==0?"00":t%3==1?"77":"ff";
    t = Math.floor(t/3);
    c += t%3==0?"00":t%3==1?"77":"ff";
    t = Math.floor(t/3);
    c += t%3==0?"00":t%3==1?"77":"ff";

    return c;
}

// Serve arbitrary files
app.use(express.static("/home/alex/Projects/multiflap/server"));

// Begin listening
http.listen(3000, function() {
   // console.log('listening on *:3000');
});

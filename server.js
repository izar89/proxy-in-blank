var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('underscore');
var Client = require('./classes/Client.js');
var sounds = require('./_js/data/sounds').sounds;
var Util = require('./_js/modules/util/Util');

/** CONFIG **/
require("./config/middleware.js")(app, express);

var port = process.env.PORT;
var clients = [];
var bounds = {
    width: 200,
    height: 800,
    border: 40
};

setInterval(function() {
    var trigger = {
    	timestamp: Date.now(),
        sound: _.sample(sounds),
        position: Util.randomPosition(bounds)
    };
    io.emit('add_trigger', trigger);
}, 1200);

io.on('connection', function(socket) {
    var max_id = 0;

    if (clients.length > 0) {
        max_id = _.max(clients, function(client) {
            return client.id;
        }).id;
    } else {
        max_id = -1;
    }

    var client = new Client(max_id + 1, socket.id);
    clients.push(client);
    socket.emit('self', client);

    _.each(clients, function(c) {
        if (c !== client) {
            socket.emit('add_companion', c);
        }
    });

    socket.broadcast.emit('add_companion', client);

    socket.on('update_position', function(coords) {
        _.findWhere(clients, {
            socketid: socket.id
        }).x = coords.x;
        _.findWhere(clients, {
            socketid: socket.id
        }).y = coords.y;

        socket.broadcast.emit('move_companion', {
            id: client.id,
            x: coords.x,
            y: coords.y
        });
    });

    socket.on('play_trigger', function(timestamp) {
        socket.broadcast.emit('trigger_played', timestamp);
    });

    socket.on('disconnect', function() {
        socket.broadcast.emit('remove_companion', client);
        clients = _.filter(clients, function(client) {
            return client.socketid !== socket.id;
        });
    });
});

server.listen(port, function() {
    console.log('Server listening at port ' + port);
});

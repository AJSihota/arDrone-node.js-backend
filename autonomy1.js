var autonomy = require('ardrone-autonomy');
var mission = autonomy.createMission();
var net = require('net');
var io = require('socket.io').listen(30001);
    events = require('events'),
    serverEmitter = new events.EventEmitter();


io.sockets.on('connection', function (socket) {
  // here you handle what happens on the 'takeoff' event
  // which will be triggered by the server later on
  mission.takeoff()
    	   .land();

  serverEmitter.on('takeoff', function (data) {
    // this message will be sent to all connected users
     mission.takeoff()
    	   .land();

    socket.emit(data);
  });
});

//  the server will emit one or more takeoff events
serverEmitter.emit('takeoff', data);

//COMMAND VARIABLES
var takeoff = "takeoff:0";
var land = "land:0";




// Enter autonomous commands here. (without socket Events)



// END of AUTONOMOUS commands.

// Run() method to ensure completion. handles err or shows successful mission.
mission.run(function(err, result){

		if(err) {
			console.trace("Something bad happened: %s", err.message);
			mission.client().stop();
			mission.client().land();

		} else {
			console.log("mission success!");
			process.exit(0);
		}

});
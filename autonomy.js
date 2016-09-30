var autonomy = require('ardrone-autonomy');
var mission = autonomy.createMission();

//var Mission = require('node_modules/ardrone-autonomy/lib/Mission.js');
var io = require('socket.io');
var net = require('net');
var HOST = '127.0.0.1'; 
var PORT = 30001; // TCP Listen Port
// var async = require('async');
var cmds = [ mission ];
//COMMAND VARIABLES
// var takeoff = "takeoff:0";
// var land = "land:0";


//Create server instance and wait for connection...
net.createServer(function(sock) {

	//Receives a connection - socket object is auto associated to connection.
	console.log('Connected: '+ sock.remoteAddress +':'+sock.remotePort);
	var command = "";
	var string = "";
	var d_index;
		
	// Add event handler here..
	sock.on('data', function(data) {
		command += data.toString();
		d_index = command.indexOf(";");
		var commandDirty = command; 
		var commandClean = "";
		// for (var i=0; i<command.length; i++)
		// {
		// 	if (commandDirty.charAt(i).match("[0-9a-z\;\:]+"))
		// 	{
		// 		commandClean += commandDirty.charAt(i);
		// 	}
		// }
		//command = command.substring(5);

		while (d_index > -1)
		{

			string = command.substring(0, d_index);
			//json = JSON.parse(JSON.stringify(string));


			stringParse(string.toString('utf-8'));
			command = command.substring(d_index+1);
			d_index = command.indexOf(";");

		}
		// mission run
		var runthis = "";
		for (var i = 0; i < cmds.length; i++)
		{
			runthis += cmds[i];
		}
		var tmpFunc = new Function(runthis);
		tmpFunc();
		//data was received in the socket..do something.
		
		// mission.takeoff()
		// 	   .land();

	});

	// add a close event handler
	sock.on('close',function(data){

		//closed connection
		console.log("CLOSED:" + sock.remoteAddress + ' ' + sock.remotePort);
	});

	

	


}).listen(PORT,HOST);



console.log('Server listening on ' + HOST + ':' + PORT);


// Enter autonomous commands here.
function stringParse(string){
	var stringSplit = string.split(":");
	//mission.array[0].array[1].
	switch (stringSplit[0])
	{
		case "takeoff":
			console.log("made it");
		
			 mission.takeoff()
			 	   .land();
			//cmds[cmds.length] = ".takeoff()";
			// .land();
			// cmds.push(function(cb){
			// 	mission._control.takeoff();
			// 
			// mission.client().takeoff();
			// mission.client().land();
			// mission.takeoff()
			// 	   .land();

			break;
		case "wait":
			mission.hover(stringSplit[1] * 1000);
			break;
		case "right":
			mission.right(stringSplit[1]);
			break;
		case "left":
			mission.left(stringSplit[1]);
			break;
		case "forward":
			mission.forward(stringSplit[1]);
			break;
		case "turnleft":
			mission.ccw(stringSplit[1]);
			break;
		case "turnright":
			mission.cw(stringSplit[1]);
			break;
		case "land":

			 mission.takeoff()
			 	   .land();
			//cmds[cmds.length] = ".land();";
			
			break;
	}
	// for (var i=0; i<=commandIndex; i++)
	// {
	// 	mission.
	// }
	
}
// mission.takeoff()
// .land();
// END of AUTONOMOUS commands.

// Run() method to ensure completion. handles err or shows successful mission.
// mission.run(function(err, result){

// 		if(err) {
// 			console.trace("Something bad happened: %s", err.message);
// 			mission.client().stop();
// 			mission.client().land();

// 		} else {
// 			console.log("mission success!");
// 			process.exit(0);
// 		}

// });
var df = require('dateformat');
autonomy = require('../');
mission  = autonomy.createMission();
arDrone = require('ar-drone');
arDroneConstants = require('ar-drone/lib/constants');

function navdata_option_mask(c) {
  return 1 << c;
}

function getAllMethods(object) {
    return Object.getOwnPropertyNames(object).filter(function(property) {
        return typeof object[property] == 'function';
    });
}

// console.log(getAllMethods(mission));

// From the SDK.
var navdata_options = (
    navdata_option_mask(arDroneConstants.options.DEMO)
  | navdata_option_mask(arDroneConstants.options.VISION_DETECT)
  | navdata_option_mask(arDroneConstants.options.MAGNETO)
  | navdata_option_mask(arDroneConstants.options.WIFI)
);

// Connect and configure the drone
// mission.client().config('general:navdata_demo', true);
// mission.client().config('general:navdata_options', navdata_options);
// mission.client().config('video:video_channel', 1);
// mission.client().config('detect:detect_type', 12);

//mission.log("mission-" + df(new Date(), "yyyy-mm-dd_hh-MM-ss") + ".txt");

var io = require('socket.io');
var net = require('net');
var HOST = '127.0.0.1'; 
var PORT = 30001; // TCP Listen Port
var async = require('async');
var cmds = [ "mission" ];
// var cmds = [ ];

net.createServer(function(sock){

  //Receives a connection - socket object is auto associated to connection.
  console.log('Connected:'+ sock.remoteAddress +':'+sock.remotePort);
  var command = "";
  var string = "";
  var d_index;
    
  // Add event handler here..
  sock.on('data', function(data) {
    command += data.toString();
    d_index = command.indexOf(";");
    
    while (d_index > -1)
    {
      string = command.substring(0, d_index);
      console.log(string);
      stringParse(string.toString('utf-8'));
      command = command.substring(d_index+1);
      d_index = command.indexOf(";");
    }
//     mission run
    // var runthis = "";
    // for (var i = 0; i < cmds.length; i++)
    //  {
    //   // runthis += cmds[i];
    //  }
     if (cmds.length > 1)
      {
        // console.log(global.mission);
          // mission  = autonomy.createMission();
                  // runthis += ";";
                  // var tmpFunc = new Function(runthis); 
                  // mission[runthis];
                  // var e = eval;
                  // console.log(e(runthis));
                  // console.log("Evaluated: " + runthis);
                  // console.log(mission);
                  // runthis = "";
      //             mission._steps.push(function(cb){
      //              mission._client.takeoff(cb);
      //           });
      //                 mission._steps.push(function(cb){
      //   mission._client.land(cb);
      // });
                  console.log(mission._steps);
                  mission.run(function (err, result) {
    if (err) {
        console.trace("Oops, something bad happened: %s", err.message);
        mission.client().stop();
        mission.client().land();
    } else {
        console.log("We are done!");
//        process.exit(0);
    }
});        
          }
    //data was received in the socket..do something.
    
    // mission.takeoff()
    //     .land();

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
//      Mission._client.takeoff();
      // mission.takeoff()
      //     .land();
       cmds[cmds.length] = ".takeoff()";
       function tkof() {
    var self = mission;
    mission._steps.push(function(cb) {
        self._client.takeoff(cb);
    });

    return mission;
}
tkof();
      // .land();
      // cmds.push(function(cb){
      //  mission._control.takeoff();
      // 
      // mission.client().takeoff();
      // mission.client().land();
      break;
    case "wait":
      cmds[cmds.length] = ".hover("+stringSplit[1] * 1000+")";
      function hvr(delay) {
    var self = mission;
    mission._steps.push(function(cb) {
        self._control.hover();
        setTimeout(cb, delay);
    });

    return mission;
}
hvr(stringSplit[1] * 1000);
      break;
    case "right":
      cmds[cmds.length] = ".right("+stringSplit[1]+")";
      function rt(distance) {
    var self = mission;
    mission._steps.push(function(cb) {
        self._control.right(distance, cb);
    });

    return mission;
}
rt(stringSplit[1]);
      break;
    case "left":
      cmds[cmds.length] = ".left("+stringSplit[1]+")";
      function lt(distance) {
    var self = mission;
    mission._steps.push(function(cb) {
        self._control.left(distance, cb);
    });

    return mission;
}
lt(stringSplit[1]);
      break;
    case "forward":
      cmds[cmds.length] = ".forward("+stringSplit[1]+")";
      function fwd(distance) {
    var self = mission;
    mission._steps.push(function(cb) {
        self._control.forward(distance, cb);
    });

    return mission;
}
fwd(stringSplit[1]);
      break;
      case "backward":
      function bwd(distance) {
    var self = mission;
    mission._steps.push(function(cb) {
        self._control.backward(distance, cb);
    });

    return mission;
}
bwd(stringSplit[1]);
    case "turnleft":
      cmds[cmds.length] = ".ccw("+stringSplit[1]+")";
      function tl(angle) {
    var self = mission;
    mission._steps.push(function(cb) {
        self._control.ccw(angle, cb);
    });

    return mission;
}
tl(stringSplit[1]);
      break;
    case "turnright":
      cmds[cmds.length] = ".cw("+stringSplit[1]+")";
      function tr(angle) {
    var self = mission;
    mission._steps.push(function(cb) {
        self._control.cw(angle, cb);
    });

    return mission;
}
tr(stringSplit[1]);
      break;
    case "land":
       cmds[cmds.length] = ".land()";
      function lnd() {
    var self = mission;
    mission._steps.push(function(cb) {
        self._client.land(cb);
    });

    return mission;
};
lnd();
      break;
  }

}



// mission.run(function (err, result) {
//     if (err) {
//         console.trace("Oops, something bad happened: %s", err.message);
//         mission.client().stop();
//         mission.client().land();
//     } else {
//         console.log("We are done!");
// //        process.exit(0);
//     }
// });


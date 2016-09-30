var df = require('dateformat');
autonomy = require('ardrone-autonomy');
mission  = autonomy.createMission();
arDrone = require('ar-drone');
arDroneConstants = require('ar-drone/lib/constants');
//Event Emitter
var Emitter = require('./emitter.js');

var client = arDrone.createClient();
var fs = require('fs');

var pngStream = client.getPngStream();
var frameCounter = 0;
var period = 1; // Save a frame every 5000 ms.
var lastFrameTime = 0;

// Functionality for Emitting Events (ImageScan)

var emtr = new Emitter();
        emtr.on('scan', function() {
          pngStream
          .on('error', console.log)
          .on('data', function(pngBuffer) {
            var now = (new Date()).getTime();
            if(frameCounter <= 1) {
              if (now - lastFrameTime > period) {
                frameCounter++;
                lastFrameTime = now;
                console.log('Saving frame');
                fs.writeFile('frame01.png', pngBuffer, function(err) {
                  if (err) {
                    console.log('Error saving PNG: ' + err);
                  }
                });
              }
            }
          });

          });


function navdata_option_mask(c) {
  return 1 << c;
}

function getAllMethods(object) {
  return Object.getOwnPropertyNames(object).filter(function(property) {
    return typeof object[property] == 'function';
  });
}

// From the SDK.
var navdata_options = (
  navdata_option_mask(arDroneConstants.options.DEMO)
  | navdata_option_mask(arDroneConstants.options.VISION_DETECT)
  | navdata_option_mask(arDroneConstants.options.MAGNETO)
  | navdata_option_mask(arDroneConstants.options.WIFI)
  );

var io = require('socket.io');
var net = require('net');
var HOST = '127.0.0.1'; 
var PORT = 30001; // TCP Listen Port
var async = require('async-waterfall');
var cmds = [ "mission" ];

net.createServer(function(sock){

  //Receives a connection - socket object is auto associated to connection.
  console.log('Connected:'+ sock.remoteAddress +':'+sock.remotePort);
  var command = "";
  var string = "";
  var d_index;

  // Add event handler here..
  sock.on('data', function(data) {
    command = "";
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

    if (cmds.length > 1)
    {
      console.log(mission._steps);
      mission.run(function (err, result) {
        if (err) {
          console.trace("Oops, something bad happened: %s", err.message);
          mission.client().stop();
          mission.client().land();
        } else {
          console.log("We are done!");
        }
      });        
    }
    
  });

  // add a close event handler
  sock.on('close',function(data){

    //closed connection
    console.log("CLOSED:" + sock.remoteAddress + ' ' + sock.remotePort);
  });

  

  


}).listen(PORT,HOST);

console.log('Server listening on ' + HOST + ':' + PORT);


/* 
 * Parse the strings received through socket from Java EE application
 * All strings will be in the format command:parameter, where command
 * is the command to be executed, such as 'forward' and the parameter
 * is how many metres to go forward, or degrees to turn, or seconds to
 * wait.
 */
function stringParse(string){
  var stringSplit = string.split(":");

  switch (stringSplit[0])
  {
    case "takeoff":
   // console.log("made it");
      // 
      function tkof() {
        var self = mission;
        mission._steps.push(function(cb) {
          self._client.takeoff(cb);
        });

        return mission;
      };
      tkof();

      break;
      case "wait":
      function hvr(delay) {
        var self = mission;
        mission._steps.push(function(cb) {
          self._control.hover();
          setTimeout(cb, delay);
        });

        return mission;
      };
      hvr(stringSplit[1] * 1000);
      break;
      case "right":
      function rt(distance) {
        var self = mission;
        mission._steps.push(function(cb) {
          self._control.right(distance, cb);
        });

        return mission;
      };
      rt(stringSplit[1]);
      break;
      case "left":
      function lt(distance) {
        var self = mission;
        mission._steps.push(function(cb) {
          self._control.left(distance, cb);
        });

        return mission;
      };
      lt(stringSplit[1]);
      break;
      case "forward":
      function fwd(distance) {
        var self = mission;
        mission._steps.push(function(cb) {
          self._control.forward(distance, cb);
        });

        return mission;
      };
      fwd(stringSplit[1]);
      break;
      case "backward":
      function bwd(distance) {
        var self = mission;
        mission._steps.push(function(cb) {
          self._control.backward(distance, cb);
        });

        return mission;
      };
      bwd(stringSplit[1]);
      case "turnleft":
        function tl(angle) {
          var self = mission;
          mission._steps.push(function(cb) {
            self._control.ccw(angle, cb);
          });

          return mission;
        };
        tl(stringSplit[1]);
        break;
      case "turnright":
        function tr(angle) {
          var self = mission;
          mission._steps.push(function(cb) {
            self._control.cw(angle, cb);
          });

          return mission;
        };
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
      case "scan":
        function scan() {
        var self = mission;
          mission._steps.push(function(cb) {
            self._control.hover();
            setTimeout(cb, 1);
            emtr.emit('scan');
          });

          return mission;
        };

        scan();
        break;
  }

}

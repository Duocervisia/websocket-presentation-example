const WebSocket = require('ws');
var importRoom = require('../app/room');
var room = new importRoom(this);
const wss = new WebSocket.Server({ port: 7071 });
const clients = new Map();
let timer;

wss.on('connection', (ws) => {

    clients.set(ws);

    ws.on('message', (messageAsString) => {
      const message = JSON.parse(messageAsString);

      //registriere oder checke
      if(message.register !== undefined){
        var registerIndex = room.checkRegister(message.register);
        
        if(registerIndex !== false){
          var messageBody = {
            accepted: registerIndex,
          };
          messageBody = {...messageBody, ...room.getJSON(false)};
          ws.send(JSON.stringify(messageBody));

          [...clients.keys()].forEach((client) => {
            client.send(room.getJSON());
          });
        }
      }else if(message.start !== undefined){
        room.start();
        gameLoop();
      }else{
        room.processRequest(message);
      }
    
    });  
});

wss.on('close', (ws) => {
  clients.delete(ws);
  console.log("user disconnected");
});


var tickLengthMs = 1000 / 60
var previousTick = Date.now()
var actualTicks = 0

function gameLoop() {
  var now = Date.now();
  actualTicks++;

  if (previousTick + tickLengthMs <= now) {
    var delta = (now - previousTick) / 1000;
    previousTick = now;

    if(!room.running){
      return
    }

    room.ballUpdate();
    [...clients.keys()].forEach((client) => {
      client.send(room.getJSON());
    });
    actualTicks = 0
  }

  if (Date.now() - previousTick < tickLengthMs - 16) {
    setTimeout(gameLoop)
  } else {
    setImmediate(gameLoop)
  }
}

function runBall(){
  var that = this;
  if(this.timer !== undefined){
    clearInterval(this.timer);
  }


  this.timer = setInterval(() => {
    if(!room.running){
      clearInterval(that.timer);
    }
    room.ballUpdate();
    [...clients.keys()].forEach((client) => {
      client.send(room.getJSON());
    });
  }, 20, room, clients);
}

console.log("wss up");
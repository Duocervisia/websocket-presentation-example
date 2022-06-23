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
        if(registerIndex === false){
          return false;
        }
        var messageBody = {
          accepted: registerIndex,
        };
        messageBody = {...messageBody, ...room.getJSON(false)};
        ws.send(JSON.stringify(messageBody));
      }else if(message.start !== undefined){
        room.start();
        runBall();
      }else{
        room.processRequest(message);
      }

      [...clients.keys()].forEach((client) => {
        client.send(room.getJSON());
      });
    });  
});

wss.on('close', (ws) => {
  clients.delete(ws);
  console.log("user disconnected");
});

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
  }, 10, room, clients);
}

console.log("wss up");
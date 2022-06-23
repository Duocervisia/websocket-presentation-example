const WebSocket = require('ws');
var importRoom = require('../app/room');
var room = new importRoom(this);
const wss = new WebSocket.Server({ port: 7071 });
const clients = new Map();
let timer;
runBall();


wss.on('connection', (ws) => {

    clients.set(ws);
    room.ballUpdate();

    ws.on('message', (messageAsString) => {
      const message = JSON.parse(messageAsString);
      const metadata = clients.get(ws);

      //registriere oder checke
      if(message.register !== undefined){
        if(!room.checkRegister(message.register)){
          return false;
        }
      }else if(message.start !== undefined){
        // if(!room.checkStart(message.register)){
        //   return false;
        // }
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

  if(this.timer !== undefined){
    clearInterval(this.timer);
  }
  this.timer = setInterval(() => {
    room.ballUpdate();
    [...clients.keys()].forEach((client) => {
      client.send(room.getJSON());
    });
  }, 10, room, clients);
}

console.log("wss up");
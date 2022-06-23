const WebSocket = require('ws');
var importRoom = require('../app/room');
var room = new importRoom(this);
const wss = new WebSocket.Server({ port: 7071 });
const clients = new Map();
let timer;
runBall();


wss.on('connection', (ws) => {
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    //room.clearRoom();

    // var playerIndex = room.addPlayer(id);

    // if(playerIndex === false){
    //   return;
    // }

    // let init = {};
    // init.id = id;
    // init.room = room.getJSON(false);
    // init.index = playerIndex;

    clients.set(ws, metadata);
    room.ballUpdate();

    // const timer = setTimeout(() => {
    //   ws.send(JSON.stringify(init));
    // }, 1000, init, ws);

    ws.on('message', (messageAsString) => {
      const message = JSON.parse(messageAsString);
      const metadata = clients.get(ws);

      //registriere oder checke
      if(message.register !== undefined){
        if(!room.checkRegister(message.register)){
          return false;
        }
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
    room.ballUpdate();
    [...clients.keys()].forEach((client) => {
      client.send(room.getJSON());
    });
  }, 10, room, clients);
}

function updateAll(){
 
  [...clients.keys()].forEach((client) => {
    client.send(room.getJSON());
  });
}


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

console.log("wss up");
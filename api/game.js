


Game = class {
  

    isApi = true;
    clients = new Map();


    constructor(){
        var importRenderer = require('../app/renderer');
        this.renderer = new importRenderer(this);

        var importRoom = require('../app/room');
        this.room = new importRoom(this);

        var importRenderer = require('../app/renderer');
        this.renderer = new importRenderer(this);


        this.initWs();
    }

    initWs(){
        const WebSocket = require('ws');
        const wss = new WebSocket.Server({ port: 7071 });
        var that = this;

        wss.on('connection', (ws) => {

            that.clients.set(ws);
        
            ws.on('message', (messageAsString) => {
              const message = JSON.parse(messageAsString);
        
              //registriere oder checke
              if(message.register !== undefined){
                var registerIndex = that.room.checkRegister(message.register);
                
                if(registerIndex !== false){
                  var messageBody = {
                    accepted: registerIndex,
                  };
                  messageBody = {...messageBody, ...that.room.getJSON(false)};
                  ws.send(JSON.stringify(messageBody));
        
                  [...that.clients.keys()].forEach((client) => {
                    client.send(that.room.getJSON());
                  });
                }
              }else if(message.start !== undefined){
                that.room.start();
                that.renderer.gameLoop();
              }else if(message.space !== undefined){
                that.room.running = true;
                that.renderer.gameLoop();
              }else{
                that.room.processRequest(message);
              }
            
            });  
        });
        
        wss.on('close', (ws) => {
          clients.delete(ws);
          console.log("user disconnected");
        });

        console.log("wss up");

    }
  
  }
if (typeof window === 'undefined')
module.exports = Game

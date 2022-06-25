var importGame = require('./game');

var game = new importGame(this);



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


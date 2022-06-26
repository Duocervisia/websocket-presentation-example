Renderer = class{

    tickLengthMs = 1000 / 60
    previousTick = Date.now()
    actualTicks = 0
    started = false;


    constructor(game){
        this.game = game;

        if(!this.game.isApi){
            this.ticker = this.game.app.ticker;

            var that = this;

            this.ticker.add(function () {
    
                if(!that.game.room.running){
                    that.ticker.stop();
                }
    
                that.tickFunction(that);
            })
        }
       
    }

    gameLoop() {
        var that = this;
        this.started = true;
        if(this.game.isApi){
            function loopFunction(started = false) {
 
                var now = Date.now();
                that.actualTicks++;
    
                if (that.previousTick + that.tickLengthMs <= now) {
                    var delta = (now - that.previousTick) / 1000;
                    that.previousTick = now;
    
    
                    if(!that.game.room.running){
                        return;
                    }
    
                    that.tickFunction(that);
                    
                    that.actualTicks = 0
                }
    
                if (Date.now() - that.previousTick < that.tickLengthMs - 16) {
                    setTimeout(loopFunction)
                } else {
                    setImmediate(loopFunction);
                }
            }
            loopFunction(true);
        }else{
            
    
            this.ticker.start();
        }

    }

    tickFunction(that){
        that.game.room.ballUpdate();

        
        if(that.game.isApi){
            if(that.game.room.ballEvent){
                that.game.room.ballEvent = false;
                var messageBody = {
                    update: true,
                  };
                [...that.game.clients.keys()].forEach((client) => {
                    client.send(that.game.room.getJSON(messageBody));
                });
            }else if(that.started){
                that.started = false;
                [...that.game.clients.keys()].forEach((client) => {
                    client.send(that.game.room.getJSON());
                });
            }
        }else{
            that.game.update();
            that.game.checkInputs();
        }

    }
   
}

if (typeof window === 'undefined')
module.exports = Renderer


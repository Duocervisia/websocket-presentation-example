Renderer = class{

    tickLengthMs = 1000 / 60
    previousTick = Date.now()
    actualTicks = 0

    constructor(game){
        this.game = game;
    }

    gameLoop() {
        var that = this;
        this.game.room.spacePressable = false;
        
        function loopFunction() {
 
            var now = Date.now();
            that.actualTicks++;

            if (that.previousTick + that.tickLengthMs <= now) {
                var delta = (now - that.previousTick) / 1000;
                that.previousTick = now;


                if(!that.game.room.running){
                    return;
                }

                that.game.room.ballUpdate();
                [...that.game.clients.keys()].forEach((client) => {
                client.send(that.game.room.getJSON());
                });
                that.actualTicks = 0
            }

            if (Date.now() - that.previousTick < that.tickLengthMs - 16) {
                setTimeout(loopFunction)
            } else {
                setImmediate(loopFunction)
            }
        }
        loopFunction();
    }
   
}

if (typeof window === 'undefined')
module.exports = Renderer


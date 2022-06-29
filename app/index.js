$( document ).ready(function() {
    var game = new Game();
    
    var intervalDuration = 10;

    var upInterval;
    var downInterval;
    var delta;

    $(document).keydown(function(e) {
        delta = Date.now();

        switch(e.which) {
            //case 38: // up
            case 87: // w
                if (!upInterval) {
                    upInterval = setInterval(() => {
                        var now = Date.now();
                        game.checkKey2("up", now - delta );  
                        delta = now;         
                    }, intervalDuration, game, delta);
                }
                break;
            //case 40: // down
            case 83: // s
                if (!downInterval) {
                    downInterval = setInterval(() => {
                        var now = Date.now();
                        game.checkKey2("down", now - delta);   
                        delta = now;         
        
                    }, intervalDuration, game);
                }
                break;
            default: return; 

        }

        e.preventDefault(); // prevent the default action (scroll / move caret)
    });

    $(document).keyup(function(e) {

        switch(e.which) {
            //case 38: // up
            case 87: // w
                clearInterval(upInterval); 
                upInterval = null;
                break;
            //case 40: // down
            case 83: // s
                clearInterval(downInterval); 
                downInterval = null;
                break;
            default: return;
        }
    });

    $(document).keypress(function(e){
        switch(e.which) {
            case 32: // space
                game.wsHandler.spacePress();
                break;
        }
    });
});

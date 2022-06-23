$( document ).ready(function() {
    var game = new Game();
    
    var intervalDuration = 10;

    var upInterval;
    var downInterval;

    $(document).keydown(function(e) {
       

        switch(e.which) {
            //case 38: // up
            case 87: // w
                if (!upInterval) {
                    upInterval = setInterval(() => {
                        game.checkKey2("up");           
                    }, intervalDuration, game);
                }
                break;
            //case 40: // down
            case 83: // s
                if (!downInterval) {
                    downInterval = setInterval(() => {
                        game.checkKey2("down");           
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
});

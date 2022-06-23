$( document ).ready(function() {
    var game = new Game();
    
    var keyInterval;
    var intervalDuration = 10;

    var upInterval;
    var downInterval;


    // $(document).keypress(function(e) {
    //     game.checkKey(e);
    //   });

    $(document).keydown(function(e) {

        switch(e.which) {
            //case 38: // up
            case 87: // w
                if (!upInterval) {
                    console.log("pressed up");
                    upInterval = setInterval(() => {
                        game.checkKey2("up");           
                    }, intervalDuration, game);
                }
                break;
            //case 40: // down
            case 83: // s
                if (!downInterval) {
                    console.log("pressed down");
                    downInterval = setInterval(() => {
                        game.checkKey2("down");           
                    }, intervalDuration, game);
                }
                break;
            default: return; 

        }

        // if (!keyInterval) {
        //     console.log("pressed up");
        //     keyInterval = setInterval(() => {
        //         game.checkKey(e);           
        //     }, 50, game);
        // }

        e.preventDefault(); // prevent the default action (scroll / move caret)
    });

    $(document).keyup(function(e) {
        console.log("up");

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
        
        // clearInterval(keyInterval); 
        // keyInterval = null;
    });
});

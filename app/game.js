
Game = class {
    leftBar;
    rightBar;

    leftCounter;
    rightCounter;
    gameArea;
    ball;


    leftTopValue = 0;
    rightTopValue = 0;

    constructor(ws, player = 0) {
        this.leftBar = $(".left-bar");
        this.rightBar = $(".right-bar");
        this.leftCounter = $(".left-counter");
        this.rightCounter = $(".right-counter");

        this.ball = $(".ball");

        this.gameArea = $(".game-area");
        this.room = new Room();
        this.wsHandler = new wsHandler(this);
        this.wsHandler.connectToServer();
        this.room = new Room(this);
    }

    update(){
        var that = this;

        this.room.players.forEach(function (player, i) {

            if(player !== that.room.ownId){
                switch(i){
                    case 0:
                        that.leftTopValue = that.room.playerPositions[i];
                        break;
                    case 1:
                        that.rightTopValue = that.room.playerPositions[i];
                        break;
                }
                
            }
        });
        this.updateCounter();
        this.updatePositions();
    }

    checkKey(e) {
        var jump = 8;

        switch(this.room.players.indexOf(this.room.ownId)){
            case 0:
                switch(e.which) {
                    case 87: // w
                        this.leftTopValue -= jump;
                        break;
                    case 83: // s
                        this.leftTopValue += jump;
                        break;
                    default: return; // exit this handler for other keys
                }

                if(this.leftTopValue < 0){
                    this.leftTopValue = 0;
                }else if(this.leftTopValue + this.leftBar[0].scrollHeight > this.gameArea[0].scrollHeight){
                    this.leftTopValue = this.gameArea[0].scrollHeight - this.leftBar[0].scrollHeight;
                }
                this.wsHandler.sendMessage(this.leftTopValue);
                break;
            case 1:
                switch(e.which) {
                    case 87: // w
                        this.rightTopValue -= jump;
                        break;
                    case 83: // s
                        this.rightTopValue += jump;
                        break;
                    default: return; // exit this handler for other keys
                }

                if(this.rightTopValue < 0){
                    this.rightTopValue = 0;
                }else if(this.rightTopValue + this.rightBar[0].scrollHeight > this.gameArea[0].scrollHeight){
                    this.rightTopValue = this.gameArea[0].scrollHeight - this.rightBar[0].scrollHeight;
                }
                this.wsHandler.sendMessage(this.rightTopValue);
                break;
        }

        this.updatePositions();
        e.preventDefault(); // prevent the default action (scroll / move caret)
    }

    checkKey2(direction) {
        var jump = 2;

        switch(this.room.players.indexOf(this.room.ownId)){
            case 0:
                switch(direction) {
                    case "up": // w
                        this.leftTopValue -= jump;
                        break;
                    case "down": // s
                        this.leftTopValue += jump;
                        break;
                    default: return; // exit this handler for other keys
                }

                if(this.leftTopValue < 0){
                    this.leftTopValue = 0;
                }else if(this.leftTopValue + this.leftBar[0].scrollHeight > this.gameArea[0].scrollHeight){
                    this.leftTopValue = this.gameArea[0].scrollHeight - this.leftBar[0].scrollHeight;
                }
                this.wsHandler.sendMessage(this.leftTopValue);
                break;
            case 1:
                switch(direction) {
                    case "up": // w
                        this.rightTopValue -= jump;
                        break;
                    case "down": // s
                        this.rightTopValue += jump;
                        break;
                    default: return; // exit this handler for other keys
                }

                if(this.rightTopValue < 0){
                    this.rightTopValue = 0;
                }else if(this.rightTopValue + this.rightBar[0].scrollHeight > this.gameArea[0].scrollHeight){
                    this.rightTopValue = this.gameArea[0].scrollHeight - this.rightBar[0].scrollHeight;
                }
                this.wsHandler.sendMessage(this.rightTopValue);
                break;
        }

        this.updatePositions();
    }

    updatePositions(){
        var that = this;
        this.leftBar.css( "top", function() {
            return that.leftTopValue;
        });
        this.rightBar.css( "top", function() {
            return that.rightTopValue;
        });
        this.ball.css( "top", function() {
            return that.room.ball.y;
        });
        this.ball.css( "left", function() {
            return that.room.ball.x;
        });
    }

    updateCounter(){
        if(this.room.playerPoints[0] !== undefined){
            this.leftCounter.text(this.room.playerPoints[0]);
        }
        if(this.room.playerPoints[1] !== undefined){
            this.rightCounter.text(this.room.playerPoints[1]);
        }
    }
  }
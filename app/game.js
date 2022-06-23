
Game = class {
    leftBar;
    rightBar;

    leftCounter;
    rightCounter;
    gameArea;
    ball;

    constructor(ws, player = 0) {
        var that = this
        this.leftBar = $(".left-bar");
        this.rightBar = $(".right-bar");
        this.leftCounter = $(".left-counter");
        this.rightCounter = $(".right-counter");
        this.startButton = $(".start-button");

        this.ball = $(".ball");

        this.gameArea = $(".game-area");
        this.room = new Room();
        this.wsHandler = new wsHandler(this);
        this.wsHandler.connectToServer();
        this.room = new Room(this);

        this.startButton.click(function(){
            if(!$(this).hasClass("disabled")){
                that.wsHandler.start();
            }
        });
    }

    update(){
        this.updateCounter();
        this.updatePositions();
    }

    checkKey2(direction) {
        var jump = 2;

        let indexOwnId = this.room.players.indexOf(this.room.ownId);

        if(indexOwnId == -1){
            return;
        }

        let position = this.room.playerPositions[indexOwnId];

        switch(direction) {
            case "up": // w
                position -= jump;
                break;
            case "down": // s
                position += jump;
                break;
            default: return; // exit this handler for other keys
        }

        if(position < 0){
            position = 0;
        }else if(position + this.leftBar[0].scrollHeight > this.gameArea[0].scrollHeight){
            position = this.gameArea[0].scrollHeight - this.leftBar[0].scrollHeight;
        }

        this.room.playerPositions[indexOwnId] = position;
        this.wsHandler.sendMessage(position);

        this.updatePositions();
    }

    checkInputs() {
        if(!this.room.running){
            this.startButton.removeClass("hidden");
            if(this.room.isRoomFull()){
                this.startButton.removeClass("disabled");
            }else{
                this.startButton.addClass("disabled");
            }
        }else{
            this.startButton.addClass("hidden");
        }
    }

    updatePositions(){
        var that = this;
        this.leftBar.css( "top", function() {
            return that.room.playerPositions[0];
        });
        this.rightBar.css( "top", function() {
            return that.room.playerPositions[1];
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
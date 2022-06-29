
Game = class {
    leftBar;
    rightBar;

    leftCounter;
    rightCounter;
    gameArea;
    ball;

    isApi = false;


    constructor(ws, player = 0) {
        var that = this
        this.leftBar = $(".left-bar");
        this.rightBar = $(".right-bar");
        this.leftCounter = $(".left-counter");
        this.rightCounter = $(".right-counter");
        this.startButton = $(".start-button");
        this.spacePress = $(".space-press");

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

        this.app = new PIXI.Application(this.gameArea.width(), this.gameArea.height(), {transparent: true, antialias: true, });
        this.mainContainer = new PIXI.Container();
        this.gameArea[0].appendChild(this.app.view);

        this.ballPixi = new Ball(this);
        this.app.stage.addChild(this.mainContainer);



    }

    update(){
        this.updateCounter();
        this.updatePositions();
    }

    checkKey2(direction, delta) {

        var jump = 2 * (delta/10);

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
        if(!this.room.running && !this.room.spacePressable){
            this.startButton.removeClass("hidden");
            if(this.room.isRoomFull()){
                this.startButton.removeClass("disabled");
            }else{
                this.startButton.addClass("disabled");
            }
        }else{
            this.startButton.addClass("hidden");
        }
        if(!this.room.running && this.room.spacePressable){
            this.spacePress.removeClass("hidden");
        }else{
            this.spacePress.addClass("hidden");
        }
    }

    updatePositions(){
        var that = this;
        if(this.leftBar.position().top !== that.room.playerPositions[0]){
            this.leftBar.css( "top", function() {
                return that.room.playerPositions[0];
            });
        }

        if(this.rightBar.position().top !== that.room.playerPositions[1]){
            this.rightBar.css( "top", function() {
                return that.room.playerPositions[1];
            });
        }

        this.ballPixi.update(that.room.ball);
        // this.ball.css( "top", function() {
        //     return that.room.ball.y;
        // });
        // this.ball.css( "left", function() {
        //     return that.room.ball.x;
        // });
    }

    updateCounter(){
        if(this.room.playerPoints[0] !== undefined && this.room.playerPoints[0] != this.leftCounter.text()){
            this.leftCounter.text(this.room.playerPoints[0]);
        }
        if(this.room.playerPoints[1] !== undefined && this.room.playerPoints[1] != this.rightCounter.text()){
            this.rightCounter.text(this.room.playerPoints[1]);
        }
    }
  }
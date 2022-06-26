Room = class{
    playersPerRoom = 2;
    players = []
    playerPositions = [];
    playerPoints = [];
    ball = {x: 65, y: 50};
    running = false;

    ownId = null;
    game;
    startingPoints = 5;
    startSpeed = 3;
    xMove = this.startSpeed;
    yMove = this.startSpeed;
    increaseCounter = 0;
    increaseFactor = 0.1;
    ballRadius = 8;
    barHeight = 80;
    barOffset = 15;
    width = 800;
    height = 450;
    
    ballEvent = false;

    constructor(game){
        this.game = game;
    }

    ballUpdate(){
        this.ball.x += this.xMove;
        this.ball.y += this.yMove;

        if(this.ball.x < this.barOffset + this.ballRadius){
            if(this.playerPositions[0] < this.ball.y && this.playerPositions[0] + this.barHeight > this.ball.y){
                this.ball.x = this.barOffset + this.ballRadius;
                this.barHit();
            }else{
                this.resetBall(0);
            }
        }else if (this.ball.x > this.width - this.ballRadius - this.barOffset){
            if(this.playerPositions[1] < this.ball.y && this.playerPositions[1] + this.barHeight > this.ball.y){
                this.ball.x = this.width - this.ballRadius - this.barOffset;
                this.barHit();
            }else{
                this.resetBall(1);
            }
        }

        if(this.ball.y < this.ballRadius){
            this.ball.y = this.ballRadius;
            this.yMove = -this.yMove
        }else if(this.ball.y > this.height - this.ballRadius){
            this.ball.y = this.height - this.ballRadius;
            this.yMove = -this.yMove
        }
    }
    barHit(){
        this.xMove = -this.xMove;
        this.increaseCounter++;
        if(this.xMove < 0){
            this.xMove -= this.increaseCounter * this.startSpeed * this.increaseFactor;
        }else{
            this.xMove += this.increaseCounter * this.startSpeed * this.increaseFactor;
        }
        if(this.yMove < 0){
            this.yMove -= this.increaseCounter * this.startSpeed * this.increaseFactor;
        }else{
            this.yMove += this.increaseCounter * this.startSpeed * this.increaseFactor;
        }
        this.ballEvent = true;
    }

    start(){
        this.running = true;
        for(var i = 0; i < this.playerPoints.length; i++){
            this.playerPoints[i] = this.startingPoints
        }
    }

    resetBall(playerIndex){
        if(this.game.isApi){
            this.ball.x = this.width/2;
            this.ball.y = this.height/2;
            this.playerPoints[playerIndex] -= 1;
            this.increaseCounter = 0;
            this.xMove = this.startSpeed;
            this.yMove = this.startSpeed;
    
            if(this.playerPoints[playerIndex] <= 0){
                this.running = false;
            }

            this.ballEvent = true;
        }
    }

    isRoomFull(){
        if(this.players.length >= this.playersPerRoom){
            return true;
        }
        return false;
    }
    addPlayer(id){
        if(this.isRoomFull()){
            return false;
        }
        var index = this.players.push(id)-1;
        this.playerPositions[index] = 0;
        this.playerPoints[index] = this.startingPoints;
        return index;
    }
    getJSON(customMessage = false){

        var messageBody = {
             players: this.players,
             playerPositions: this.playerPositions, 
             ball: this.ball,
             xMove: this.xMove, 
             yMove: this.yMove, 
             playerPoints: this.playerPoints,
             running: this.running
        };
        messageBody = {...customMessage, ...messageBody};

        return JSON.stringify(messageBody)
     
    }

    processServerRequest(message){
        var that = this;
        var startedRunning = false;

        this.players = message.players;
        this.playerPoints = message.playerPoints;

        if(this.running === false && message.running === true){
            startedRunning = true;
        }

        this.running = message.running;

        if(message.update === true){
            this.ball = message.ball;
            this.xMove = message.xMove;
            this.yMove = message.yMove;
        }

        message.players.forEach(function (player, i) {
            if(message.accepted !== undefined || player !== that.ownId){
                that.playerPositions[i] = message.playerPositions[i];
            }
        });

        if(startedRunning){
            this.game.renderer.gameLoop();
        }
        this.game.update();
        this.game.checkInputs();
    }

    processRequest(message){
        var index = this.players.indexOf(message.player);
        this.playerPositions[index] = message.position;
    }

    clearRoom(){
        this.playerPositions = []
        this.players = []
    }

    checkRegister(id){
        let index = this.players.indexOf(id);
        if(index === -1){
            if(!this.isRoomFull()){
                return this.addPlayer(id);
            }
            return false;
        }
        return index;
    }
}

if (typeof window === 'undefined')
module.exports = Room


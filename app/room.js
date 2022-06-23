Room = class{
    playersPerRoom = 2;
    players = []
    playerPositions = [];
    playerPoints = [];
    ball = {x: 50, y: 50};
    ownId = null;
    game;
    xStart = 2;
    yStart = 2;
    xMove = this.xStart;
    yMove = this.yStart;
    increaseCounter = 0;
    increaseFactor = 0.3;
    ballRadius = 8;
    barHeight = 80;
    barOffset = 15;
    

    width = 800;
    height = 450;

    constructor(game){
        this.game = game;
    }

    ballUpdate(){
        this.ball.x += this.xMove;
        this.ball.y += this.yMove;

        if(this.ball.x < this.barOffset + this.ballRadius){
            if(this.playerPositions[0] < this.ball.y && this.playerPositions[0] + this.barHeight > this.ball.y){
                this.xMove = -this.xMove;
                this.increaseCounter++;
                if(this.xMove < 0){
                    this.xMove -= this.increaseCounter * this.xStart * this.increaseFactor;
                }else{
                    this.xMove += this.increaseCounter * this.xStart * this.increaseFactor;
                }
            }else{
                this.resetBall();
                this.playerPoints[0] -= 1;
                this.increaseCounter = 0;
                this.xMove = this.xStart;
            }
        }else if (this.ball.x > this.width - this.ballRadius - this.barOffset){
            if(this.playerPositions[1] < this.ball.y && this.playerPositions[1] + this.barHeight > this.ball.y){
                this.xMove = -this.xMove;
                this.increaseCounter++;
                if(this.xMove < 0){
                    this.xMove -= this.increaseCounter * this.xStart * this.increaseFactor;
                }else{
                    this.xMove += this.increaseCounter * this.xStart * this.increaseFactor;
                }
            }else{
                this.resetBall();
                this.playerPoints[1] -= 1;
                this.increaseCounter = 0;
                this.xMove = this.xStart;
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

    resetBall(){
        this.ball.x = this.width/2;
        this.ball.y = this.height/2;
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
        this.playerPoints[index] = 5;
        return index;
    }
    getJSON(parse = true){

        var messageBody = { players: this.players, playerPositions: this.playerPositions, ball: this.ball, playerPoints: this.playerPoints };
        if(parse){
            return JSON.stringify(messageBody)
        }

        return messageBody
    }

    processServerRequest(message){
        var that = this;

        this.players = message.players;
        this.ball = message.ball;
        this.playerPoints = message.playerPoints;

        message.players.forEach(function (player, i) {
            if(player !== that.ownId){
                that.playerPositions[i] = message.playerPositions[i];
            }
        });
        this.game.update();
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
        if(index == -1){
            if(!this.isRoomFull()){
                this.addPlayer(id);
                return true;
            }
            return false;
        }
        return true;
    }
}

if (typeof window === 'undefined')
module.exports = Room


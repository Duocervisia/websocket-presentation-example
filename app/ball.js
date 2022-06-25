Ball = class{
    size = 16;

    constructor(game) {
        this.game = game;
        this.setSprite();
    }

    setSprite() {
        var gr  = new PIXI.Graphics();
        // gr.beginFill(0xffffff);
        gr.beginFill(0x3700B3, 1);
        gr.drawCircle(0, 0, this.size/2);
        gr.endFill();

        this.gr = gr;
        this.game.mainContainer.addChild(this.gr);
    }
    
    update(position){
        this.gr.position.x = position.x;
        this.gr.position.y = position.y;
    }
}
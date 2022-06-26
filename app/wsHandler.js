wsHandler = class{

    ws;
    game;

    constructor(game) {
        this.game = game;
    }

    async connectToServer() {
        var that = this;
        const newWS = new WebSocket('ws://192.168.188.52:7071/ws');
        await new Promise((resolve, reject) => {
            const timer = setInterval(() => {

                if(newWS.readyState === 1) {
                    console.log("ready");
                    clearInterval(timer);
                    resolve(newWS);
                    that.ws = newWS;
                }
            }, 10);
        });

        await this.setEvents();
        this.initMessage();

    }

    initMessage(){
        let cookieId = this.getCookie("id");
        if (cookieId == "") {
            cookieId = this.uuidv4();
            this.setCookie("id", cookieId, 1);
        }
        this.game.room.ownId = cookieId;
        const messageBody = { register: cookieId};

        this.ws.send(JSON.stringify(messageBody));
    } 
    
    async setEvents(){
        this.ws.onmessage = async (webSocketMessage) => {
            const messageBody = JSON.parse(webSocketMessage.data);
            this.game.room.processServerRequest(messageBody);
        };
    }

    start(){
        const messageBody = { start: this.game.room.ownId};
        this.ws.send(JSON.stringify(messageBody));
    }

    async sendMessage(position){
        const messageBody = { player: this.game.room.ownId , position: position };
        this.ws.send(JSON.stringify(messageBody));
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
        }
        return "";
    }
  
    setCookie(cname,cvalue,exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }
}
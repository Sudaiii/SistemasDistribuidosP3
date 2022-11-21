class Auction{

    constructor(messenger, item){
        this.messenger = messenger;
        this.item = item;
        this.participants = []
        this.started = false;
        this.finished = false;
        this.bestOffer = 0;
        this.currentWinnderID = 0;

    }

     join(id){
        if(!this.finished){
            this.participants.push(id)
            if(!this.started && this.participants.length > 1){
                // this.messenger.groupCommunicate("La subasta ha iniciado", participants);
                this.started = true;
            }
            return 2;
        }
        else if(!this.participants.includes(id)){
            return 1;
        }
        else{
            return 0;
        }
     }

     remove(id){
        if(this.participants.includes(id)){
            let found = false;
            const i = this.participants.indexOf(id);
            if (i > -1) {
                this.participants.splice(i, 1);
            }
            // messenger.groupCommunicate("Cliente " + clientID + " se ha retirado", participants);
            // messenger.groupCommunicate("Participantes restantes: " + participants.size(), participants);
            this.checkFinish();
            return true;
        }
        else{
            return false;
        }
     }

     offer(id, offer){
        if(!this.finished && offer > this.bestOffer){
            this.bestOffer = offer;
            this.currentWinnderID = id;
            // messenger.groupCommunicate("Cliente " + clientID + " ha hecho una oferta de " + offer, participants);
            // hammer.reset();
            // auctionLog.addRecord(clientID, offer, true);
            // auctionLog.setBest(clientID, offer);
            return true;
        }
        // auctionLog.addRecord(clientID,offer,false);
        return false;
     }

    checkFinish(){
        if(!this.finished && this.started && this.participants.size() < 2) {
            this.finish();
        }
    }

     finish() {
        this.finished = true;
        // messenger.groupCommunicate("\nLa subasta ha acabado", participants);
        // messenger.groupCommunicate("Ganador: Usuario " + currentWinnerID + " por " + bestOffer, participants);
        // messenger.groupCommunicate("Usuarios restantes deben usar comando \"retirarse\" " +
        //     "si desean participar en otra subasta", participants );
        // auctionLog.deploy();
    }

    pressure(message) {
        if(this.started && !this.finished) {
            //messenger.groupCommunicate(message, participants);
        }
    }

}
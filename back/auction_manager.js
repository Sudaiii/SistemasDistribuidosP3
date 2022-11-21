class AuctionManager {

    constructor(messenger) {
        this.messenger = messenger;
        this.auctions = []
        // this.createAuctions();
    }

    getAuctions() {
        let auctionStrings = [];
        for(let i = 0; i < this.auctions.length; i++) {
            let status = "";
            if(this.auctions[i].finished) {
                status = "Finalizada";
            }
            else{
                status = "Disponible";
            }
            auctionStrings.push(this.auctions[i].item + " - " + status);
        }
        return auctionStrings;
    }

    offer(auctionID, clientID, amount){
        return this.auctions[auctionID].offer(clientID, amount);
    }

    addClientToAuction(auctionID, clientID){
        return this.auctions[auctionID].join(clientID);
    }

    removeClientFromAuction(auctionID,  clientID){
        return this.auctions[auctionID].remove(clientID);
    }

    getAuctionInfo(auctionID){
        let bestOffer = this.auctions[auctionID].bestOffer.toString();
        let currentWinnerID = this.auctions[auctionID].currentWinnderID.toString();
        let participants = this.auctions[auctionID].participants.length.toString();
        return "Subasta: " + this.auctions[auctionID].item + "\n" +
            "Cantidad de participantes: " + participants + "\n" +
            "Mejor oferta: " + bestOffer + "\n" +
            "Cliente de la mejor oferta: " + currentWinnerID + "\n";
    }

    getBestOffer(auctionID){
        return this.auctions[auctionID].bestOffer;
    }

    getCurrentWinderID(auctionID){
        return this.auctions[auctionID].currentWinnderID;
    }

    isAuctionFinished(auctionID){
        return this.auctions[auctionID].finished;
    }

    // createAuctions(){
    //     try {
    //         Reader reader = new Reader();
    //         File file = new File(pathFile);
    //         reader.loadLines(file.getAbsolutePath());
    //         ArrayList<String> itemList = reader.getFilesContent();
    //         for (String item: itemList) {
    //             Auction auction = new Auction(this.messenger, item);
    //             this.auctions.add(auction);
    //         }
    //     }catch (Exception e){
    //         System.out.println(e.getMessage());
    //     }
    // }
}

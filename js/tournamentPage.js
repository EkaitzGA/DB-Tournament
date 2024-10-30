

export class TournamentFight{
    constructor(parentId){
    this.parentId = parentId
    this.parent = document.getElementById(parentId);
    this.favFighters = favFighters
    this.createTournamentChart()
}

createTournamentChart(){

}


createTournamentFighters(){
    this.tournamentFightersContainer = document.createElement("div");
    this.tournamentFightersContainer.id = "tournament-fighters";
    this.parent.appendChild(this.tournamentFightersContainer);
}

    displayTournamentFighters() {
        this.favFighters.forEach(fighter => {
          const tournamentCardContainer = document.createElement("div");
          tournamentCardContainer.id = `tournament-fighter-container-${fighter.id}`;
          this.tournamentFightersContainer.appendChild(tournamentCardContainer);
    
          new FavFighterCard(fighter,cardContainer.id,this.favFighters);
        })
      }
}





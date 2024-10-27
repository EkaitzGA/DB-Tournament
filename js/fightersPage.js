import { store } from "./store.js";

class FavFighterCard {
  constructor(fighter, parentId) {
    this.fighter = fighter;
    this.parentId = parentId;
    this.parent = document.getElementById(parentId);
    this.createCard();
  }

  createCard() {
    this.card = document.createElement("div");
    this.card.id = "fighter-card";

    this.backgroundPic = document.createElement("img")
    this.backgroundPic.id = "fighter-background-pic"
    this.backgroundPic.src = ("../multimedia/favBackgroundCutted.jpg")

    this.fighterPic = document.createElement("img");
    this.fighterPic.id = "fighter-pic"
    this.fighterPic.src = this.fighter.image;
    this.fighterPic.alt = "imagen de " + this.fighter.name;

    this.info = document.createElement("div")
    this.info.id = "fighter-info"

    let raceInfo = this.fighter.race
    if(raceInfo.includes("Nucleico")){
      raceInfo = "God"
    }
    this.info.innerHTML =
      `<h3>${this.fighter.name}</h3>
    <p> Race: ${raceInfo}</p>`;

    this.GoFightButton = document.createElement("button")
    this.GoFightButton.id = "fight-button"
    this.GoFightButton.innerText = "GO FIGHT!"

    this.card.append(this.backgroundPic, this.info, this.GoFightButton,this.fighterPic);
   /*  this.backgroundPic.appendChild(this.fighterPic) */

    this.parent.appendChild(this.card);
  }
}


class FightersPage {
  constructor(parentId) {
    this.parentId = parentId
    this.parent = document.getElementById(parentId);
    this.showFighters();
  }

  showFighters() {
    const fighters = store.getFightersData();
    if (fighters && fighters.items) {
      this.createFightersGrid();
      this.displayFighters(fighters.items);
    } /* else {
          this.showError("No fighters data available");
      } */
  }

  createFightersGrid() {
    this.gridContainer = document.createElement("div");
    this.gridContainer.id = "fighters-grid";
    this.parent.appendChild(this.gridContainer);
  }

  displayFighters(fighters) {
    fighters.forEach(fighter => {
      const cardContainer = document.createElement("div");
      cardContainer.id = `fighter-container-${fighter.id}`;
      this.gridContainer.appendChild(cardContainer);

      new FavFighterCard(fighter, cardContainer.id);
    });
  }

  /* showError(message) {
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = message;
      this.parent.appendChild(errorDiv);
  } */
}

export default FightersPage;
import { store } from "./store.js";


export class FilterBar {
  constructor(parentId, onFilterChange) {
    this.parentId = parentId
    this.parent = document.getElementById(parentId)
    this.onFilterChange = onFilterChange
    this.createFilterContainer()
    this.createRaceSelector()
    /* this.createSortByPower() */

  }

  createFilterContainer() {
    this.filters = document.createElement("div")
    this.filters.classList.add("filter-bar")
    this.parent.appendChild(this.filters)
  }

  createRaceSelector() {
    const selector = this.createSelector()
    const fighters = store.getFightersData();

    const normalizedRaces = fighters.items.map(item => ({
      ...item, race: item.race.includes("Nucleico") ? "God" : item.race
    }));

    const uniqueRaces = [...new Set(normalizedRaces.map(item => item.race))];

    const options = uniqueRaces.map(race => { return { value: race, title: race } })

    options.unshift({
      value: "all",
      title: "All races"
    })
    this.addSelectorOptions(selector, options);
    selector.addEventListener("change", (e) => {
      const selectedRace = e.target.value;
      this.onFilterChange(selectedRace);
    })
    return selector;

  }
  createSelector() {
    this.selector = document.createElement("select");
    this.selector.classList.add("race-selector")
    this.filters.appendChild(this.selector);
    return this.selector
  }
  addSelectorOptions(selector, options) {
    for (const option of options) {
      const optionElement = document.createElement("option")
      optionElement.value = option.value
      optionElement.innerText = option.title;
      this.selector.appendChild(optionElement)
    }
    return selector
  }
  /* createSortByPower() {

  } */

}

class FightersPage {
  constructor(parentId) {
    this.parentId = parentId
    this.parent = document.getElementById(parentId);
    this.currentFilter = "all"
    this.filterBar = new FilterBar(parentId, (race) => this.filterFighters(race))
    this.showFighters();
  }
  filterFighters(race) {
    this.currentFilter = race;
    if (this.gridContainer) {
      this.gridContainer.innerHTML = ""
    }
    this.showFighters()
  }

  showFighters() {
    const fighters = store.getFightersData();
    if (fighters && fighters.items) {
        if (!this.gridContainer) {
            this.createFightersGrid();
        }
        
      
        let filteredFighters = fighters.items;
        if (this.currentFilter !== "all") {
            filteredFighters = fighters.items.filter(fighter => {
                const fighterRace = fighter.race.includes("Nucleico") ? "God" : fighter.race;
                return fighterRace === this.currentFilter;
            });
        }
        
        this.displayFighters(filteredFighters); 
    }
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
    if (raceInfo.includes("Nucleico")) {
      raceInfo = "God"
    }
    this.info.innerHTML =
      `<h3>${this.fighter.name}</h3>
    <p> Race: ${raceInfo}</p>`;

    this.GoFightButton = document.createElement("button")
    this.GoFightButton.id = "fight-button"
    this.GoFightButton.innerText = "GO FIGHT!"

    this.card.append(this.backgroundPic, this.info, this.GoFightButton, this.fighterPic);
    /*  this.backgroundPic.appendChild(this.fighterPic) */

    this.parent.appendChild(this.card);
  }
}

export default FightersPage;

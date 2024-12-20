import { store } from "./store.js";
import { TournamentFight } from "./tournamentPage.js";


export class FilterBar {
  constructor(parentId, onFilterChange) {
    this.parentId = parentId
    this.parent = document.getElementById(parentId)
    this.onFilterChange = onFilterChange
    this.createFilterContainer()
    this.createRaceSelector()
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
}

class FightersPage {
  constructor(parentId) {
    this.parentId = parentId
    this.parent = document.getElementById(parentId);
    this.currentFilter = "all"
    this.filterBar = new FilterBar(parentId, (race) => this.filterFighters(race))
    this.tournamentCounter = new Tournament(parentId)
    this.showFighters();
  }
  filterFighters(race) {
    this.currentFilter = race;
    if (this.gridContainer) {
      this.gridContainer.innerHTML = ""
    }
    this.showFighters()
  }
  getSelectedFighters() {
    const savedFighters = localStorage.getItem('tournamentFighters');
    return savedFighters ? JSON.parse(savedFighters) : [];
  }

  isFighterSelected(fighter) {
    const selectedFighters = this.getSelectedFighters();
    return selectedFighters.some(selected => selected.fighter.id === fighter.id);
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

      const availableFighters = filteredFighters.filter(fighter => !this.isFighterSelected(fighter))

      this.displayFighters(availableFighters);
    }
  }

  createFightersGrid() {
    this.gridContainer = document.createElement("div");
    this.gridContainer.id = "fighters-grid";
    this.parent.appendChild(this.gridContainer);
  }

  displayFighters(fighters) {
    this.gridContainer.innerHTML = ""
    fighters.forEach(fighter => {
      const cardContainer = document.createElement("div");
      cardContainer.id = `fighter-container-${fighter.id}`;
      this.gridContainer.appendChild(cardContainer);

      new FavFighterCard(fighter, cardContainer.id, (fighterCard) => {
        this.tournamentCounter.addFighter(fighterCard);
        this.showFighters()
      }
      );
    });
  }

}
class FavFighterCard {
  constructor(fighter, parentId, addFighter) {
    this.addFighter = addFighter
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
    this.info.innerHTML = `<h3>${this.fighter.name}</h3><p> Race: ${raceInfo}</p>`;

    this.GoFightButton = document.createElement("button")
    this.GoFightButton.id = "fight-button"
    this.GoFightButton.innerText = "FIGHT!"
    this.GoFightButton.addEventListener("click", () => this.addFighter(this))

    this.card.append(this.backgroundPic, this.info, this.GoFightButton, this.fighterPic);

    this.parent.appendChild(this.card);
  }
}

export class Tournament {
  constructor(parentId) {
    this.parentId = parentId
    this.parent = document.getElementById(parentId);
    this.maxFighters = 8
    this.favFighters = [];
    this.addFighter = this.addFighter.bind(this);
    this.loadSavedFighters()
    this.createCounter()
    this.resetButton()
    this.startTournament()
  }

  createCounter() {
    this.counter = document.createElement("p")
    this.counter.classList.add("counter")
    this.counter.innerText = `Tournament roster: ${this.favFighters.length}/${this.maxFighters}`
    this.parent.appendChild(this.counter)
  }

  saveFighterToStorage(fighter) {
    const fighterData = {
      id: fighter.fighter.id,
      name: fighter.fighter.name,
      race: fighter.fighter.race,
      image: fighter.fighter.image
    };

    const savedFighters = this.getSavedFighters();
    savedFighters.push(fighterData);
    localStorage.setItem('tournamentFighters', JSON.stringify(savedFighters));
  }

  getSavedFighters() {
    const savedFighters = localStorage.getItem('tournamentFighters');
    return savedFighters ? JSON.parse(savedFighters) : [];
  }

  loadSavedFighters() {
    const savedFighters = this.getSavedFighters();
    savedFighters.forEach(fighterData => {
      const fighter = {
        fighter: fighterData,
        card: null
      };
      this.favFighters.push(fighter);
    });
  }

  addFighter(fighter) {
    if (this.favFighters.length >= this.maxFighters) {
      return;
    }
    this.favFighters.push(fighter);
    this.saveFighterToStorage(fighter);
    this.updateDisplay(fighter);
  }

  updateDisplay(fighter) {
    this.counter.innerText = `Tournament roster: ${this.favFighters.length}/${this.maxFighters}`
    if (fighter.card) {
      fighter.card.remove()
    }
  }

  resetButton() {
    this.reset = document.createElement("button")
    this.reset.id = "reset-button"
    this.reset.classList.add("tournament-button")
    this.reset.innerText = "Reset fighters"
    this.parent.appendChild(this.reset)
    this.reset.addEventListener("click", () => this.actualReset())
  }
  actualReset() {
    this.favFighters = []
    localStorage.removeItem("tournamentFighters")
    this.counter.innerText = `Tournament roster: ${this.favFighters.length}/${this.maxFighters}`

    const grid = document.getElementById("fighters-grid")
    if (grid) {
      grid.innerHTML = ""
    }

    const fighters = store.getFightersData()
    if (fighters && fighters.items) {
      fighters.items.forEach(fighter => {
        const cardContainer = document.createElement("div")
        cardContainer.id = `fighter-container-${fighter.id}`
        grid.appendChild(cardContainer)

        new FavFighterCard(fighter, cardContainer.id, this.addFighter)
      })
    }
  }

  startTournament() {
    this.goTournament = document.createElement("button")
    this.goTournament.id = "go-tournament-button"
    this.goTournament.classList.add("tournament-button")
    this.goTournament.innerText = "Save and START TOURNAMENT"
    this.parent.appendChild(this.goTournament)
    this.goTournament.addEventListener("click", () => this.showTournamentPage())
  }

  showTournamentPage() {
    if (this.favFighters.length != this.maxFighters) {
      alert("You need to complete the roster to start the tournament")
      return
    }
    while (this.parent.firstChild) {
      this.parent.removeChild(this.parent.firstChild)
    }
    const tournamentFighters = this.favFighters.map(fighter => ({
      fighter: fighter.fighter || fighter
    }))

    new TournamentFight(this.parentId, tournamentFighters);
  }
}

export default FightersPage;

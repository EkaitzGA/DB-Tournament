export class TournamentFight {
    constructor(parentId, favFighters) {
        this.parentId = parentId
        this.parent = document.getElementById(parentId);
        if (!favFighters || favFighters.length === 0) {
            this.displayErrorMessage();
            return;
        }
        this.favFighters = favFighters
        this.startTournament()
    }

    displayErrorMessage() {
        const errorElement = document.createElement("div")
        errorElement.id = ("tournament-error-message")
        errorElement.textContent = "Not enough fighters have been selected for tournament, please go to the fighters roster"
        const errorPicSatan = document.createElement("img")
        errorPicSatan.id = ("error-satan")
        errorPicSatan.src = ("../multimedia/mrsatan.webp")
        this.parent.appendChild(errorPicSatan)
        this.parent.appendChild(errorElement)
    }

    startTournament() {
        this.createTournamentLayout()
        this.createTournamentHeader()
        this.createTournamentFighters()
        this.displayTournamentFighters()
        this.createTournamentGrid()
    }

    // Crear un contenedor principal para el torneo
    createTournamentLayout() {
        this.tournamentContainer = document.createElement("div");
        this.tournamentContainer.id = "tournament-container";
        this.tournamentContainer.style.position = "relative";
        this.parent.appendChild(this.tournamentContainer);
    }

    createTournamentHeader() {
        const header = document.createElement("div");
        header.classList.add("tournament-header");

        const title = document.createElement("h2");
        title.textContent = `Tournament: ${this.favFighters.length} Fighters`;

        header.appendChild(title);
        this.tournamentContainer.appendChild(header);
    }

    createTournamentFighters() {
        this.tournamentFightersContainer = document.createElement("div");
        this.tournamentFightersContainer.id = "tournament-fighters";
        this.tournamentContainer.appendChild(this.tournamentFightersContainer);
    }

    displayTournamentFighters() {
        this.favFighters.forEach((fighterCard, index) => {
            const tournamentCardContainer = document.createElement("div");
            tournamentCardContainer.id = `tournament-fighter-container-${index}`;
            this.tournamentFightersContainer.appendChild(tournamentCardContainer);

            this.createTournamentCard(fighterCard.fighter, tournamentCardContainer.id)
        })
    }

    createTournamentCard(fighter, containerId) {
        const container = document.getElementById(containerId);

        const card = document.createElement("div");
        card.id = "fighter-card";

        const backgroundPic = document.createElement("img");
        backgroundPic.id = "fighter-background-pic";
        backgroundPic.src = "../multimedia/favBackgroundCutted.jpg";
        backgroundPic.alt = "fondo de carta"


        const fighterImage = document.createElement("div");
        fighterImage.classList.add("tournament-fighter-image");

        const fighterPic = document.createElement("img");
        fighterPic.id = "fighter-pic";
        fighterPic.src = fighter.image;
        fighterPic.alt = "imagen de " + fighter.name;

        const info = document.createElement("div");
        info.id = "fighter-info";

        let raceInfo = fighter.race;
        if (raceInfo.includes("Nucleico")) {
            raceInfo = "God";
        }

        info.innerHTML = `
            <h3>${fighter.name}</h3>
            <p>Race: ${raceInfo}</p>
        `;


        card.append(backgroundPic, info, fighterPic);
        container.appendChild(card);
    }

    createTournamentGrid() {
        const gridContainer = document.createElement("div");
        gridContainer.classList.add("tournament-grid-container");

        this.simFightButton = document.createElement("button")
        this.simFightButton.classList.add("sim-fight-button")
        this.simFightButton.innerText = "Simulate Fight"

        for (let i = 1; i < 15; i++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("tournament-grid-item", `item-${i}`);
            gridContainer.appendChild(gridItem);
        }

        this.tournamentContainer.append(gridContainer, this.simFightButton);
    }
}





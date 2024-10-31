export class TournamentFight {
    constructor(parentId, favFighters) {
        this.parentId = parentId
        this.parent = document.getElementById(parentId);
        const savedFighters = this.getSavedFighters()
        this.favFighters = favFighters || this.convertSavedFighters(savedFighters)
        if (!favFighters || favFighters.length === 0) {
            this.displayErrorMessage();
            return;
        }

        this.startTournament()

    }
    getSavedFighters() {
        const savedFighters = localStorage.getItem('tournamentFighters');
        return savedFighters ? JSON.parse(savedFighters) : [];
    }
    convertSavedFighters(savedFighters) {
        if (!savedFighters || savedFighters.length === 0) return null;

        return savedFighters.map(fighter => ({
            fighter: fighter
        }));
    }
    displayErrorMessage() {
        const savedFighters = this.getSavedFighters()
        if (savedFighters && savedFighters.length > 0) {
            this.favFighters = this.convertSavedFighters(savedFighters)
            this.startTournament()
            return
        }

        const errorElement = document.createElement("div")
        errorElement.id = ("tournament-error-message")
        errorElement.textContent = "Not enough fighters have been selected for tournament, please go to the fighters roster! NOW!"

        const errorPicSatan = document.createElement("img")
        errorPicSatan.id = ("error-satan")
        errorPicSatan.src = ("../multimedia/mrsatan.webp")
        this.parent.appendChild(errorPicSatan)
        this.parent.appendChild(errorElement)
    }

    startTournament() {
        while (this.parent.firstChild) {
            this.parent.removeChild(this.parent.firstChild);
        }

        this.createTournamentLayout()
        this.createTournamentHeader()
        this.createTournamentFighters()
        this.displayTournamentFighters()
        this.createTournamentGrid()
        this.selectFighter()
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
        title.textContent = "Click first on the fighter and then on an empty spot to add it. Click on Tournament to reset.";

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
        card.draggable = true

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

    selectFighter() {
        let selectedFighter = null;
        const fighterContainers = document.querySelectorAll('[id^="tournament-fighter-container-"]');
        const validGridCells = document.querySelectorAll('.tournament-grid-item.item-1, .tournament-grid-item.item-2, .tournament-grid-item.item-3, .tournament-grid-item.item-4, .tournament-grid-item.item-5, .tournament-grid-item.item-6, .tournament-grid-item.item-7, .tournament-grid-item.item-8');

        validGridCells.forEach(cell => {
            cell.classList.add("valid-cell")
        })
        //Seleccionar luchador
        fighterContainers.forEach(container => {
            const card = container.querySelector('#fighter-card')

            card.addEventListener('click', () => {
                if (selectedFighter) {
                    selectedFighter.classList.remove('selected-fighter')
                }
                if (selectedFighter === card) {
                    selectedFighter = null;
                    return;
                }

                selectedFighter = card;
                card.classList.add('selected-fighter')
            });
        });
        //Colocarlo en el grid
        validGridCells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (!selectedFighter) return

                if (cell.hasChildNodes()) {
                    return
                }

                // En lugar de clonar toda la tarjeta, extraemos solo la imagen del luchador
                const fighterImage = selectedFighter.querySelector('#fighter-pic')
                const clonedImage = fighterImage.cloneNode(true)

                // Cambiamos las clases de la imagen clonada si es necesario
                clonedImage.classList.add('grid-fighter')
                clonedImage.classList.remove('selected-fighter')

                // Agregamos solo la imagen a la celda
                cell.appendChild(clonedImage)

                selectedFighter.classList.add('placed-fighter');
                selectedFighter.classList.remove('selected-fighter');
                selectedFighter = null;
            })
        })



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

        this.fighterCards = document.querySelectorAll('[id^="tournament-fighter-container-"]');
        this.gridCells = document.querySelectorAll('.tournament-grid-item');


    }

}





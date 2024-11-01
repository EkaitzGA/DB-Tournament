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
        const advancedCells = document.querySelectorAll('.tournament-grid-item.item-9, .tournament-grid-item.item-10, .tournament-grid-item.item-11, .tournament-grid-item.item-12, .tournament-grid-item.item-13, .tournament-grid-item.item-14');

        validGridCells.forEach(cell => {
            cell.classList.add("valid-cell")
        })

        advancedCells.forEach(cell => {
            cell.style.opacity = '0.3';
        });

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

        validGridCells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (!selectedFighter) return

                if (cell.hasChildNodes()) {
                    return
                }
                const fighterImage = selectedFighter.querySelector('#fighter-pic')
                const clonedImage = fighterImage.cloneNode(true)

                clonedImage.classList.add('grid-fighter')
                clonedImage.classList.remove('selected-fighter')

                cell.appendChild(clonedImage)

                selectedFighter.style.opacity = '0.3';
                selectedFighter.classList.add('placed-fighter');
                selectedFighter.classList.remove('selected-fighter');
                selectedFighter = null;
            })
        })
    }

    createTournamentGrid() {
        const gridContainer = document.createElement("div");
        gridContainer.classList.add("tournament-grid-container");

        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("tournament-buttons");

        // Botón Auto-Fill
        this.autoFillButton = document.createElement("button");
        this.autoFillButton.classList.add("tournament-button");
        this.autoFillButton.innerText = "Auto-Fill";

        this.simFightButton = document.createElement("button")
        this.simFightButton.classList.add("tournament-button")
        this.simFightButton.innerText = "Simulate Fight"
        this.simFightButton.disabled = true

        for (let i = 1; i < 15; i++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("tournament-grid-item", `item-${i}`);
            gridContainer.appendChild(gridItem);
        }
        buttonsContainer.append(this.autoFillButton, this.simFightButton)
        this.tournamentContainer.append(gridContainer, buttonsContainer);

        this.fighterCards = document.querySelectorAll('[id^="tournament-fighter-container-"]');
        this.gridCells = document.querySelectorAll('.tournament-grid-item');

        this.autoFillButton.addEventListener('click', () => this.autoFillGrid());

        this.simFightButton.addEventListener('click', () => {
            const placedFighters = document.querySelectorAll('.tournament-grid-item img');
            if (placedFighters.length === 8) {
                this.simulateFights();
            } else {
                alert('Please place all 8 fighters on the outside cells before simulating!');
            }
        });

    }
    autoFillGrid() {
        // Limpiar el grid primero
        const validCells = document.querySelectorAll('.tournament-grid-item.item-1, .tournament-grid-item.item-2, .tournament-grid-item.item-3, .tournament-grid-item.item-4, .tournament-grid-item.item-5, .tournament-grid-item.item-6, .tournament-grid-item.item-7, .tournament-grid-item.item-8');
        validCells.forEach(cell => {
            cell.innerHTML = '';
        });
    
        // Resetear todos los luchadores
        const fighterCards = document.querySelectorAll('[id^="tournament-fighter-container-"] #fighter-card');
        fighterCards.forEach(card => {
            card.style.opacity = '1';
            card.classList.remove('placed-fighter', 'selected-fighter');
        });
    
        // Convertir NodeList a Array para poder mezclarlo
        const fighterCardsArray = Array.from(fighterCards);
        const validCellsArray = Array.from(validCells);
    
        // Mezclar aleatoriamente los luchadores
        const shuffledFighters = fighterCardsArray.sort(() => Math.random() - 0.5);
    
        // Colocar los primeros 8 luchadores en las celdas
        for (let i = 0; i < 8 && i < shuffledFighters.length; i++) {
            const fighter = shuffledFighters[i];
            const cell = validCellsArray[i];
            
            // Clonar y colocar la imagen del luchador
            const fighterImg = fighter.querySelector('#fighter-pic').cloneNode(true);
            fighterImg.classList.add('grid-fighter');
            cell.appendChild(fighterImg);
    
            // Marcar el luchador como colocado
            fighter.style.opacity = '0.3';
            fighter.classList.add('placed-fighter');
        }
        this.simFightButton.disabled = false;
    }
    async simulateFights() {
        const firstRoundPairs = [
            { fighter1: 1, fighter2: 2, destination: 9 },
            { fighter1: 3, fighter2: 4, destination: 10 },
            { fighter1: 5, fighter2: 6, destination: 11 },
            { fighter1: 7, fighter2: 8, destination: 12 }
        ]

        const secondRoundPairs = [
            { fighter1: 9, fighter2: 10, destination: 13 },
            { fighter1: 11, fighter2: 12, destination: 14 }
        ]

        this.simulateRound(firstRoundPairs)

        await this.simulateRoundSequentially(firstRoundPairs)
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.simulateRoundSequentially(secondRoundPairs)
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.chooseFinalWinner()
    }
    async simulateRoundSequentially(pairs) {
        for (const pair of pairs) {
            await this.simulateRound(pair)
        }
    }

    async simulateRound(pair) {
        return new Promise(resolve => {
            const fighter1Cell = document.querySelector(`.tournament-grid-item.item-${pair.fighter1}`)
            const fighter2Cell = document.querySelector(`.tournament-grid-item.item-${pair.fighter2}`)
            const destinationCell = document.querySelector(`.tournament-grid-item.item-${pair.destination}`)

            const winner = Math.random() < 0.5 ? fighter1Cell : fighter2Cell
            const winnerImage = winner.querySelector('img').cloneNode(true)

            fighter1Cell.style.opacity = '0.3';
            fighter2Cell.style.opacity = '0.3';

            fighter1Cell.querySelector("img")?.classList.add("eliminated")
            fighter2Cell.querySelector("img")?.classList.add("eliminated")

            winnerImage.classList.add('advancing-fighter')

            destinationCell.innerHTML = ""
            destinationCell.style.opacity = '1'
            destinationCell.appendChild(winnerImage)

            setTimeout(resolve, 2000)
        })
    }

    chooseFinalWinner() {
        const finalist1 = document.querySelector('.tournament-grid-item.item-13')
        const finalist2 = document.querySelector('.tournament-grid-item.item-14')
        const winner = Math.random() < 0.5 ? finalist1 : finalist2
        const winnerImage = winner.querySelector('img')

        document.querySelectorAll('.advancing-fighter, .eliminated, .tournament-winner').forEach(el => {
            el.classList.remove('advancing-fighter', 'eliminated', 'tournament-winner')
        })
        winnerImage.classList.add("tournament-winner")

        this.showWinnerModal(winnerImage)
    }
    showWinnerModal(winnerImage) {
        // Crear elementos del modal
        const modalOverlay = document.createElement('div');
        modalOverlay.classList.add('modal-overlay');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const title = document.createElement('h2');
        title.classList.add('modal-title');
        title.textContent = 'Tournament Champion!';

        const winnerImg = winnerImage.cloneNode(true);
        winnerImg.classList.add('modal-winner-image');

        const question = document.createElement('p');
        question.classList.add('modal-question');
        question.textContent = '¿Quieres volver a simular?';

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('modal-buttons');

        const yesButton = document.createElement('button');
        yesButton.classList.add('modal-button', 'modal-button-yes');
        yesButton.textContent = 'SÍ';

        const noButton = document.createElement('button');
        noButton.classList.add('modal-button', 'modal-button-no');
        noButton.textContent = 'NO';

        // Añadir eventos a los botones
        yesButton.addEventListener('click', () => {
            modalOverlay.remove();
            this.restartSimulation();
        });

        noButton.addEventListener('click', () => {
            modalOverlay.remove();
            this.resetTournament();
        });

        // Construir el modal
        buttonsContainer.append(yesButton, noButton);
        modalContent.append(title, winnerImg, question, buttonsContainer);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }

    resetTournament() {
        // Eliminar clases y estilos de la simulación anterior
        const allGridItems = document.querySelectorAll('.tournament-grid-item');
        allGridItems.forEach(item => {
            item.innerHTML = '';
            item.style.opacity = '1';
        });

        // Resetear los luchadores disponibles
        const fighterCards = document.querySelectorAll('[id^="tournament-fighter-container-"] #fighter-card');
        fighterCards.forEach(card => {
            card.style.opacity = '1';
            card.classList.remove('placed-fighter', 'selected-fighter');
        });

        // Resetear las celdas avanzadas
        const advancedCells = document.querySelectorAll('.tournament-grid-item.item-9, .tournament-grid-item.item-10, .tournament-grid-item.item-11, .tournament-grid-item.item-12, .tournament-grid-item.item-13, .tournament-grid-item.item-14');
        advancedCells.forEach(cell => {
            cell.style.opacity = '0.3';
        });
        this.simFightButton.disabled = true;
    this.autoFillButton.disabled = false;
    }

    restartSimulation() {
        // Guardar las posiciones actuales de los luchadores en las celdas iniciales
        const initialFighters = [];
        for (let i = 1; i <= 8; i++) {
            const cell = document.querySelector(`.tournament-grid-item.item-${i}`);
            const fighterImg = cell.querySelector('img');
            if (fighterImg) {
                initialFighters.push({
                    position: i,
                    image: fighterImg.cloneNode(true)
                });
            }
        }

        // Limpiar todas las celdas y estilos
        const allGridItems = document.querySelectorAll('.tournament-grid-item');
        allGridItems.forEach(item => {
            item.innerHTML = '';
            item.style.opacity = '1';
        });

        // Restaurar los luchadores a sus posiciones iniciales
        initialFighters.forEach(fighter => {
            const cell = document.querySelector(`.tournament-grid-item.item-${fighter.position}`);
            fighter.image.classList.add('grid-fighter');
            cell.appendChild(fighter.image);
        });

        // Resetear las celdas avanzadas
        const advancedCells = document.querySelectorAll('.tournament-grid-item.item-9, .tournament-grid-item.item-10, .tournament-grid-item.item-11, .tournament-grid-item.item-12, .tournament-grid-item.item-13, .tournament-grid-item.item-14');
        advancedCells.forEach(cell => {
            cell.style.opacity = '0.3';
        });

        // Mantener los luchadores originales como "placed"
        const fighterCards = document.querySelectorAll('[id^="tournament-fighter-container-"] #fighter-card');
        fighterCards.forEach(card => {
            card.style.opacity = '0.3';
            card.classList.add('placed-fighter');
            card.classList.remove('selected-fighter');
        });

        // Iniciar nueva simulación después de un pequeño delay
        setTimeout(() => {
            this.simulateFights();
        }, 500);
    }
}

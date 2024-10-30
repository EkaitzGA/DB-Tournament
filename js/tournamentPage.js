

export class TournamentFight {
    constructor(parentId, favFighters) {
        this.parentId = parentId
        this.parent = document.getElementById(parentId);
        if (!favFighters || favFighters.length === 0) {
            console.error('No fighters selected for tournament, please go to fighters roster');
            return;
        }
        this.favFighters = favFighters
        this.startTournament()
    }

    startTournament() {
        this.createTournamentLayout()
        this.createTournamentHeader()
        this.createTournamentFighters()
        this.displayTournamentFighters()
    }

    createTournamentLayout() {
        // Crear un contenedor principal para el torneo
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
        this.tournamentFightersContainer.style.width = "300px";
        this.tournamentFightersContainer.style.display = "flex";
        this.tournamentFightersContainer.style.flexDirection = "column";
        this.tournamentFightersContainer.style.gap = "20px";
        this.tournamentFightersContainer.style.padding = "20px";
        this.parent.appendChild(this.tournamentFightersContainer);
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
/* 
    createTournamentChart() {

    } */
}





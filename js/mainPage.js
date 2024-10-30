import { fetchData } from "./api.js"
import FightersPage from "./fightersPage.js"


class MainPageCard {
    constructor(parentId) {
        this.parentId = parentId
        this.parent = document.getElementById(parentId)
        this.createWelcomeCard()
        this.asignNavLogic();
    }
    
    asignNavLogic() {
        const roster = document.getElementById("nav-roster");
        /* const tournament = document.getElementById("nav-tournament"); */
        
      
        roster.addEventListener("click", () => this.showFightersPage());
        /* tournament.addEventListener("click", () => iratournament); */
      }
    createWelcomeCard() {
        this.cardContainer = document.createElement("div")
        this.cardContainer.id = "card-container"
        
        this.leftContent = document.createElement("div")
        this.leftContent.classList.add("left-content")
        
    
        this.messageContainer = document.createElement("img")
        this.messageContainer.id = "message-container"
        this.messageContainer.src = ("../multimedia/bocadillorelleno.png")
        
        this.announcerPic = document.createElement("img")
        this.announcerPic.id = "announcer-pic"
        this.announcerPic.src = ("../multimedia/announcer.png")
        
        this.showFightersButton = document.createElement("button")
        this.showFightersButton.id = "main-button"
        this.showFightersButton.innerText = "Show me fighters roster"
        this.showFightersButton.addEventListener("click", async () => {
            try {
                await fetchData();
                this.showFightersPage();
            } catch (error) {
                console.error("Error loading fighters", error)
            }
        });

        this.cardContainer.append(this.leftContent, this.announcerPic)
        this.leftContent.append(this.messageContainer,this.showFightersButton)
        

        this.parent.appendChild(this.cardContainer)
    }
    showFightersPage() {
        while (this.parent.firstChild) {
            this.parent.removeChild(this.parent.firstChild)
        }
        
        new FightersPage(this.parentId);
    }
}

export default MainPageCard
import { fetchData } from "./api.js"
import FightersPage from "./fightersPage.js"
import {FilterBar} from "./fightersPage.js"

class MainPageCard {
    constructor(parentId) {
        this.parentId = parentId
        this.parent = document.getElementById(parentId)
        this.createWelcomeCard()
    }

    createWelcomeCard() {
        this.cardContainer = document.createElement("div")
        this.cardContainer.id = "card-container"

        this.leftContent = document.createElement("div")
        this.leftContent.classList.add("left-content")
        
        this.welcomeMessage = document.createElement("h3")
        this.welcomeMessage.id = "welcome-message"
        this.welcomeMessage.innerText = "Welcome to the Dragon Ball Tournament! \nThe place where the best fighters in the universe will clash in a mighty battle for glory! \n\nLEEEET'S GOOOOOOO!"
        
        this.messageContainer = document.createElement("img")
        this.messageContainer.id = "message-container"
        this.messageContainer.src = ("../multimedia/bocadillo2.png")

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
        this.leftContent.append(this.messageContainer,this.welcomeMessage, this.showFightersButton)
        

        this.parent.appendChild(this.cardContainer)
    }
    showFightersPage() {
        while (this.parent.firstChild) {
            this.parent.removeChild(this.parent.firstChild)
        }
        
        /* new FilterBar(this.parentId); */
        new FightersPage(this.parentId);
    }
}

export default MainPageCard
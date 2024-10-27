import { store } from "./store.js";

const apiUrl = "https://dragonball-api.com/api/characters?limit=60";

export async function fetchData() {
    try {
        const response = await fetch(apiUrl)
        const fightersRoster = await response.json();
        store.setFightersData(fightersRoster);
        return fightersRoster;
    } catch (error) {
        console.error(error);
        throw error
    }
}
console.log(fetchData(apiUrl))


class Store {
    constructor() {
        this.fightersData = null;
    }

    setFightersData(data) {
        this.fightersData = data;
    }

    getFightersData() {
        return this.fightersData;
    }
}

export const store = new Store();
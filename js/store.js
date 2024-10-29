class Store {
    constructor() {
        this.fightersData = [];
    }

    setFightersData(data) {
        this.fightersData = data;
    }

    getFightersData() {
        return this.fightersData;
    }
}

export const store = new Store();
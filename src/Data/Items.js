class Item {
    ID = 0;
    Name = '';
    Description = '';
    CategoryID = 0; // TODO - Faire un système de catégorie fixe
    Stats = {
        'int': 0,
        'soc': 0,
        'for': 0,
        'end': 0,
        'agi': 0,
        'dex': 0
    };
    Color = ''; // TODO - Faire un système de couleur fixe
    XML = ''; // TODO - Gérer les XML avec les ID
}

class Items {
    constructor() {
        /**
         * @type {Item[]}
         */
        this.items = [];
    }

    Save() {
        return this.items;
    }
    Load(items) {
        if (typeof(items) === 'object') {
            this.items = items;
        }
    }
}

export default Items;
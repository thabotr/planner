class ItemType {
    length: number;
    mES: number;
    pES: number;
    id: string;
    constructor(length: number, mES: number, pES: number, id: string) {
        this.length = length;
        this.id = id;
        this.mES = mES;
        this.pES = pES;
    }
};

export default ItemType;
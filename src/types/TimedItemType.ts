import ItemType from "./ItemType";

export default class TimedItemType extends ItemType {
    startTime: number;
    constructor(id: string, length: number, pES: number, mES: number, startTime: number) {
        super(length, mES, pES, id);
        this.startTime = startTime;
    }
}
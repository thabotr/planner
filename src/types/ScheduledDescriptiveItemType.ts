import DescriptiveItemType from "./DescriptiveItemType";

class ScheduledDescriptiveItemType extends DescriptiveItemType {
    startsAtMillis: number;
    constructor(id: string, length: number, pES: number, mES: number, description: string, startsAtMillis: number) {
        super(id, length, pES, mES, description);
        this.startsAtMillis = startsAtMillis;
    }
}

export default ScheduledDescriptiveItemType;
import ItemType from "./ItemType";

class DescriptiveItemType extends ItemType {
    description: string;
    constructor(id: string, length: number, pES: number, mES: number, description: string) {
        super(length, mES, pES, id);
        this.description = description;
    }
}

export default DescriptiveItemType;
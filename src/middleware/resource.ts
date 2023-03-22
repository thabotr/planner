import type DescriptiveItemType from '../types/DescriptiveItemType';
class Resource {
    async getTasks(): Promise<Array<DescriptiveItemType>> {
        // make get request
        return [];
    }

    async createTask(task: DescriptiveItemType) {
        // make post request
    }
}

export {Resource};
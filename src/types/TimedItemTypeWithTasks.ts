import type ScheduledDescriptiveItemType from "./ScheduledDescriptiveItemType";
import TimedItemType from "./TimedItemType";

class TimedItemTypeWithTasks extends TimedItemType {
    scheduledTasks: ScheduledDescriptiveItemType[];
    constructor(
        id: string,
        length: number,
        pES: number,
        mES: number,
        startTime: number,
        scheduledTasks: ScheduledDescriptiveItemType[],
    ) {
        super(id, length, pES, mES, startTime);
        this.scheduledTasks = scheduledTasks;
    }
}

export default TimedItemTypeWithTasks;
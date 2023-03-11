
function percentToIntegralIndex(percent?: number): number {
    const zeroToTen = (percent ?? 0) / 10;
    return Math.floor(zeroToTen);
}
const firstElevenPseudoFibonacciNumbers = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
function toSubjectiveEffortScore(percent?: number): number {
    const intergralIndex = percentToIntegralIndex(percent);
    return firstElevenPseudoFibonacciNumbers[intergralIndex];
}

function verboseTimestamp(diffInMs: number): string {
    const diffSecs = Math.floor(diffInMs / 1_000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays > 0) {
        return `${diffDays}dy`;
    }
    if (diffHrs > 0) {
        return `${diffHrs}h`;
    }
    if (diffMins > 0) {
        return `${diffMins}m`;
    }
    return `${diffSecs}s`;
}

const getRandomTime = () => Math.round(Math.random() * 1_000 * 60 * 60 * 24);

type TaskType = {
    pES: number,    // mental effort score
    mES: number,    // mental effort score
    length: number,     // time investment in milliseconds
}

type AvailabilityType = TaskType & {
    from: number,       // start time in milliseconds
};

type ScheduleItemType = {
    timeslot: AvailabilityType & { id: number },
    tasks: TaskType[],
};

class Scheduler {
    add(tslot: AvailabilityType): number | null {
        const item: ScheduleItemType = {
            timeslot: { ...tslot, id: this.#getId() },
            tasks: [],
        };

        const listIsEmpty = this.#list.length === 0;
        if (listIsEmpty) {
            this.#list.push(item);
            return item.timeslot.id;
        }

        let left = 0;
        let right = this.#list.length - 1;

        let middle: number;
        while (right - left > 1) {
            middle = Math.floor((right - left) / 2);
            if (this.#overlapsWithItemAt(tslot, left)) { return null; }
            if (this.#goesBeforeItemAt(tslot, middle)) { right = middle; }
            else { left = middle; }
        }

        if (this.#overlapsWithItemAt(tslot, left)) { return null; }

        if (this.#goesBeforeItemAt(tslot, left)) { this.#list.unshift(item); }
        else { this.#list.push(item); }

        return item.timeslot.id;
    }
    schedule(task: TaskType): number | null {
        for (let tslotIndex = 0; tslotIndex < this.#list.length; ++tslotIndex) {
            const scheduleTasks = this.#list[tslotIndex].tasks;
            const allTasks = scheduleTasks.concat(task);
            const superTask = allTasks.reduce((prev, curr) => ({
                length: prev.length + curr.length,
                mES: prev.mES + curr.mES,
                pES: prev.pES + curr.pES,
            }));
            const timeslot = this.#list[tslotIndex].timeslot;
            const superTaskFitsIntoTimeslot = timeslot.length >= superTask.length &&
                timeslot.mES >= superTask.mES && timeslot.pES >= superTask.pES

            if (superTaskFitsIntoTimeslot) {
                this.#list[tslotIndex].tasks = allTasks;
                return tslotIndex;
            }

        }
        return null;
    }
    getScheduleOn(day: Date): ScheduleItemType[] {
        const dayMask: AvailabilityType = {
            from: day.getTime(),
            length: AvailabilityDS.ADayInMillis,
            mES: 0,
            pES: 0,
        };
        return this.#list.filter((_, index) => this.#overlapsWithItemAt(dayMask, index));
    }
    remove(timeslotId: number): TaskType[] | null {
        let foundTslot2Rmv = false;
        for (const index in this.#list) {
            const { timeslot } = this.#list[index];
            foundTslot2Rmv = timeslot.id === timeslotId;
            if (foundTslot2Rmv) {
                const indexOfTSlot2Rmv = Number.parseInt(index);
                const lastItemIndex = this.#list.length - 1;
                const tasks4Tslot2rmv = this.#list[indexOfTSlot2Rmv].tasks;
                this.#list[indexOfTSlot2Rmv] = this.#list[lastItemIndex];
                this.#list.pop();
                return tasks4Tslot2rmv;
            }
        }
        return null;
    }
    #goesBeforeItemAt(tslot: AvailabilityType, index: number): boolean {
        const { timeslot: tslotAtIndex } = this.#list[index];
        return tslot.from < tslotAtIndex.from;
    }
    #overlapsWithItemAt(newTslot: AvailabilityType, index: number): boolean {
        const { timeslot } = this.#list[index];
        const newTslotStartContainedInTslot = timeslot.from <= newTslot.from &&
            newTslot.from <= timeslot.from + timeslot.length;
        const newTslotEndContainedInTslot = timeslot.from <= newTslot.from + newTslot.length &&
            newTslot.from + newTslot.length <= timeslot.from + timeslot.length;
        const newTslotContainsTslot = newTslot.from <= timeslot.from &&
            timeslot.from <= newTslot.from + newTslot.length;
        return newTslotStartContainedInTslot || newTslotEndContainedInTslot ||
            newTslotContainsTslot;
    }
    #id = 0;
    #getId() { ++this.#id; return this.#id - 1; }
    #list: ScheduleItemType[] = [];
}

class AvailabilityDS {
    // requirements
    // can add availability
    // cannot add availability if it intersects with already existing availability
    // should be able to provide us with this conflicting availability

    // can remove availability - should return it along with its scheduled contents else null

    // can schedule contents over some given availability provided the availability has enough capacity
    // can get scheduled contents and what part of the availability they consume

    // can split availability

    // can merge two adjacent availabilities else return false

    // can get availability given a single day
    list: Array<AvailabilityType> = [];
    #advancedList: Array<{ availability: AvailabilityType, tasks: TaskType[] }> = [];

    addAvailability(item: AvailabilityType): AvailabilityType | null {
        const availabilityOverlapsWithItem = (av: AvailabilityType) => item.from >= av.from && item.from <= av.from + av.length;
        if (this.list.some(availabilityOverlapsWithItem)) {
            return null;
        }
        this.list.push(item);
        return item;
    }
    getAvailabilityForDay(day: Date): Array<AvailabilityType> {
        const dayStartTime = day.getTime();
        const dayEndTime = dayStartTime + AvailabilityDS.ADayInMillis;
        return this.list.filter(av => av.from >= dayStartTime && av.from < dayEndTime);
    }

    scheduleTask(task: TaskType): AvailabilityType | null {
        return this.list.find(av => av.length >= task.length && av.mES >= task.mES && av.pES >= task.pES) ?? null;
    }

    clearAllAvailability() {
        this.list = [];
    }

    static ADayInMillis = 1_000 * 60 * 60 * 24;
    static AnHourInMillis = 1_000 * 60 * 60;
    static AMinuteInMillis = 1_000 * 60;
}

export { toSubjectiveEffortScore, verboseTimestamp, getRandomTime, AvailabilityDS, Scheduler, type AvailabilityType, type TaskType };
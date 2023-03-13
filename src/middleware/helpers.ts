
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
    id: string,
    description: string,
    pES: number,    // mental effort score
    mES: number,    // mental effort score
    length: number,     // time investment in milliseconds
}

type AvailabilityType = TaskType & {
    from: number,       // start time in milliseconds
};

type ScheduleItemType = {
    timeslot: AvailabilityType,
    tasks: TaskType[],
};

class Scheduler {
    add(tslot: AvailabilityType): string | null {
        const overlapsWithExtistingTimeslots = this.#list.some(((_, i) => this.#overlapsWithItemAt(tslot, i)));
        if (overlapsWithExtistingTimeslots) {
            return null;
        }

        const item: ScheduleItemType = {
            timeslot: tslot,
            tasks: [],
        };

        this.#list.push(item);

        this.#list.sort(({ timeslot: a }, { timeslot: b }) => a.from - b.from);

        return tslot.id;
    }
    schedule(task: TaskType): {timeslotId: string, taskId: string} | null {
        for (let tslotIndex = 0; tslotIndex < this.#list.length; ++tslotIndex) {
            const scheduleTasks = this.#list[tslotIndex].tasks;
            const allTasks = scheduleTasks.concat(task);
            const superTask = allTasks.reduce((prev, curr) => ({
                length: prev.length + curr.length,
                mES: prev.mES + curr.mES,
                pES: prev.pES + curr.pES,
                description: "",
                id: "",
            }));
            const timeslot = this.#list[tslotIndex].timeslot;
            const superTaskFitsIntoTimeslot = timeslot.length >= superTask.length &&
                timeslot.mES >= superTask.mES && timeslot.pES >= superTask.pES

            if (superTaskFitsIntoTimeslot) {
                this.#list[tslotIndex].tasks = allTasks;
                return {timeslotId: timeslot.id, taskId: task.id};
            }

        }
        return null;
    }
    getScheduleOn(day: Date): ScheduleItemType[] {
        const dayMask: AvailabilityType = {
            from: day.getTime(),
            length: TimeInMillis.Day,
            mES: 0,
            pES: 0,
            description: "",
            id: "",
        };
        return this.#list.filter((_, index) => this.#overlapsWithItemAt(dayMask, index));
    }
    remove(timeslotId: string): TaskType[] | null {
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
    clear() {
        this.#list = [];
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
    #list: ScheduleItemType[] = [];
}

enum TimeInMillis {
    Day = 1_000 * 60 * 60 * 24,
    Hour = 1_000 * 60 * 60,
    Minute = 1_000 * 60,
};

export {
    toSubjectiveEffortScore,
    verboseTimestamp,
    getRandomTime,
    TimeInMillis,
    Scheduler,
};

export type {
    ScheduleItemType,
    AvailabilityType,
    TaskType,
};

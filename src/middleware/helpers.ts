
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

function dateToMs(date: Date): number {
    return date.getTime();
}

function dateFromMs(ms: number): Date {
    return new Date(ms);
}

function nowInMs(): number {
    return new Date().getTime();
}

function millisSinceStartOfDay(time?: number): number {
    const today = dateFromMs(nowInMs());
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfTodayInMillis = dateToMs(startOfToday);
    if (time === undefined) {
        return nowInMs() - startOfTodayInMillis;
    }
    return time - startOfTodayInMillis;
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
    dateToMs,
    dateFromMs,
    nowInMs,
    millisSinceStartOfDay,
};

export type {
    ScheduleItemType,
    AvailabilityType,
    TaskType,
};

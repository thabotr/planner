
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

    clearAllAvailability() {
        this.list = [];
    }

    static ADayInMillis = 1_000 * 60 * 60 * 24;
    static AnHourInMillis = 1_000 * 60 * 60;
    static AMinuteInMillis = 1_000 * 60;
}

export { toSubjectiveEffortScore, verboseTimestamp, getRandomTime, AvailabilityDS, type AvailabilityType, type TaskType };
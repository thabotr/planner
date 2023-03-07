
function percentToIntegralIndex(percent?: number): number {
    const zeroToTen = (percent ?? 0) / 10;
    return Math.floor(zeroToTen);
}
const firstElevenPseudoFibonacciNumbers = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
function toSubjectiveEffortScore(percent?: number): number {
    const intergralIndex = percentToIntegralIndex(percent);
    return firstElevenPseudoFibonacciNumbers[intergralIndex];
}

function toTimeStamp(diffInMs: number): string {
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

export { toSubjectiveEffortScore, toTimeStamp };
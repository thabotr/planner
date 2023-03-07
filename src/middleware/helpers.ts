
function percentToIntegralIndex(percent?: number): number {
    const zeroToTen = (percent ?? 0) / 10;
    return Math.floor(zeroToTen);
}
const firstElevenPseudoFibonacciNumbers = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
function toSubjectiveEffortScore(percent?: number): number {
    const intergralIndex = percentToIntegralIndex(percent);
    return firstElevenPseudoFibonacciNumbers[intergralIndex];
}

function toTimeStamp(percent?: number): string {
    if (percent === undefined) {
        return "0s";
    }
    if (percent < 20) {
        const mins = Math.round(60 * percent / 20);
        return `${mins}m`;
    }
    if (percent >= 20 && percent < 60) {
        const hours = Math.floor(1 + 24 * (percent - 20) / (60 - 20));
        return `${hours}h`;
    }
    if (percent >= 60 && percent < 80) {
        const days = Math.floor(1 + 7 * (percent - 60) / (80 - 60));
        return `${days}dy`;
    }
    if (percent >= 80 && percent < 90) {
        const weeks = Math.floor(1 + 4 * (percent - 80) / (90 - 80));
        return `${weeks}wk`;
    }
    const months = Math.floor(1 + 12 * (percent - 90) / (100 - 90));
    return `${months}mth`;
}

export { toSubjectiveEffortScore, toTimeStamp };
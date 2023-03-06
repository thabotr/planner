const firstElevenPseudoFibonacciNumbers = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
function toSubjectiveEffortScore(percent?: number): number {
    const zeroToTen = (percent ?? 0)/10;
    const intergralIndex = Math.floor(zeroToTen);
    return firstElevenPseudoFibonacciNumbers[intergralIndex];
}

export { toSubjectiveEffortScore };
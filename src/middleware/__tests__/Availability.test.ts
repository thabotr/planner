
import { describe, it, expect, beforeEach } from 'vitest';
import { AvailabilityDS, Scheduler, type AvailabilityType, type TaskType } from '../helpers';

describe('AvailabilityDS Test', () => {
    describe('getScheduleOn', () => {
        it('returns an empty array given a day with no timeslots', () => {
            const aSaturdayWithNoAvailability = new Date(2023, 1, 4);
            const schedule = scheduler.getScheduleOn(aSaturdayWithNoAvailability);
            expect(schedule).toHaveLength(0);
        });
        it('returns the schedule of the given day', () => {
            const wedThursNFriAvailability = wedAvailability.concat(thursAvailability).concat(friAvailability);
            shuffleArray(wedThursNFriAvailability);
            wedThursNFriAvailability.forEach(tslot => scheduler.add(tslot));
            const thursday = new Date(2023, 1, 2);

            const daySchedule = scheduler.getScheduleOn(thursday);
            const availability = daySchedule.map(sch => sch.timeslot);

            const idAgnosticThursAvailability = thursAvailability.map(av => ({ ...av, id: expect.any(Number) }))
            expect(availability).toStrictEqual(expect.arrayContaining(idAgnosticThursAvailability));
        });
        const fiveAMThurs = getTime(2023, 1, 2, 5);
        const sevenAMThurs = getTime(2023, 1, 2, 7);
        const elevenAMThurs = getTime(2023, 1, 2, 11);
        const twelveAMFri = getTime(2023, 1, 3);
        const friAvailability: Array<AvailabilityType> = [
            {
                mES: 89,
                pES: 34,
                length: 6 * AvailabilityDS.AnHourInMillis,
                from: twelveAMFri,
            }
        ];
        const thursAvailability: Array<AvailabilityType> = [
            {
                mES: 10,
                pES: 50,
                length: AvailabilityDS.AnHourInMillis,
                from: fiveAMThurs,
            },
            {
                mES: 5,
                pES: 75,
                length: 2 * AvailabilityDS.AnHourInMillis,
                from: sevenAMThurs,
            },
            {
                mES: 89,
                pES: 5,
                length: 1.5 * AvailabilityDS.AnHourInMillis,
                from: elevenAMThurs,
            }
        ];
    });
    describe('addAvailability', () => {
        it('it stores the availability and returns a copy on success', () => {
            const result = avd.addAvailability(av);

            const hasStoredAv = avd.list.some(e => e.from === av.from);

            expect(hasStoredAv).toBeTruthy();
            expect(result).toBe(av);
        });
        it('it returns null when the added availability overlaps with an existing availability', () => {
            avd.addAvailability(av);
            const aMinuteFromNow = now + AvailabilityDS.AMinuteInMillis;
            const conflictingAv = {
                from: aMinuteFromNow,
                length: AvailabilityDS.AnHourInMillis,
                mES: 30,
                pES: 70,
            };

            const result = avd.addAvailability(conflictingAv);

            expect(result).toBeNull();
        });
        const now = new Date().getTime();
        const av: AvailabilityType = {
            from: now,
            length: AvailabilityDS.AnHourInMillis,
            mES: 50,
            pES: 50,
        };
        beforeEach(() => {
            avd.clearAllAvailability();
        });
    });
    describe('scheduleTask', () => {
        it("returns null if no availability can be found to satisfy the current task", () => {
            const withInsatiableMES: TaskType = taskWith({ mES: maxMES + 1 });
            expect(avd.scheduleTask(withInsatiableMES)).toBeNull();

            const withInsatiablePES: TaskType = taskWith({ pES: maxPES + 1 });
            expect(avd.scheduleTask(withInsatiablePES)).toBeNull();

            const withInsatiableLength: TaskType = taskWith({ length: longestTime + 1 });
            expect(avd.scheduleTask(withInsatiableLength)).toBeNull();
        });
        it("returns the next availability within which the task can be succesfully scheduled", () => {
            const medianLength = (shortestTime + longestTime) / 2;
            const withMedianLength: TaskType = taskWith({ length: medianLength });
            const availabilityWithBiggestLength = wedAvailability[1];

            const availabilitySatisfyingTaskWithMedianLength = avd.scheduleTask(withMedianLength);
            expect(availabilitySatisfyingTaskWithMedianLength).toBe(availabilityWithBiggestLength);

            const lessThanMinLength = shortestTime / 2;
            const withLessThanMinLength: TaskType = taskWith({ length: lessThanMinLength });
            const availabilityWithShortestLength = wedAvailability[0];

            const availabilitySatisfyingTaskWithLengthLessThanMinLength = avd.scheduleTask(withLessThanMinLength);
            expect(availabilitySatisfyingTaskWithLengthLessThanMinLength).toBe(availabilityWithShortestLength);
        });
        it.skip("returns null if and only if the availability which could satisfy the task have been used", () => {
            const maxLengthAv = wedAvailability[1];
            avd.clearAllAvailability(); // to ensure the av doesn't conflict with any old avs
            const biggerThanMaxLengthAV = {
                ...maxLengthAv,
                length: AvailabilityDS.AnHourInMillis + maxLengthAv.length,
            };
            const perfectFitTask: TaskType = {
                ...biggerThanMaxLengthAV,
            };
            avd.addAvailability(biggerThanMaxLengthAV);

            const resultBeforeAVIsUsed = avd.scheduleTask(perfectFitTask);
            expect(resultBeforeAVIsUsed).toBe(biggerThanMaxLengthAV);

            const aSimilarySizedTaskToPerfectFit: TaskType = { ...perfectFitTask };
            const resultAfterAVIsUsed = avd.scheduleTask(aSimilarySizedTaskToPerfectFit);
            expect(resultAfterAVIsUsed).toBeNull();
        });
        beforeEach(() => {
            avd.clearAllAvailability();
            wedAvailability.forEach(av => {
                const result = avd.addAvailability(av);
                expect(av).toBe(result);
            });
        });
        const taskWith = (overrides: Partial<TaskType>): TaskType => ({
            pES: minPES,
            mES: minMES,
            length: shortestTime,
            ...overrides,
        });
        const [minMES, maxMES] = wedAvailability.map(av => av.mES).sort();
        const [minPES, maxPES] = wedAvailability.map(av => av.pES).sort();
        const [shortestTime, longestTime] = wedAvailability.map(av => av.length).sort();
    });
    const avd = new AvailabilityDS();
    const scheduler = new Scheduler();
    const elevenPMWed = getTime(2023, 1, 1, 23);
    const onePMWed = getTime(2023, 1, 1, 13);
    const wedAvailability: Array<AvailabilityType> = [
        {
            mES: 34,
            pES: 21,
            length: 0.5 * AvailabilityDS.AnHourInMillis,
            from: elevenPMWed,
        },
        {
            mES: 55,
            pES: 89,
            length: 2 * AvailabilityDS.AnHourInMillis,
            from: onePMWed,
        },
    ];
});

/* Randomize array in-place using Durstenfeld shuffle algorithm
source https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
function shuffleArray(array: Array<any>) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function getTime(year: number, month: number, day: number, hour?: number): number {
    return new Date(year, month, day, hour).getTime();
}
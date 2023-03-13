
import { describe, it, expect, beforeEach } from 'vitest';
import { TimeInMillis, Scheduler, type ScheduleItemType, type AvailabilityType, type TaskType } from '../helpers';

describe.skip('AvailabilityDS Test', () => {
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
                length: 6 * TimeInMillis.Hour,
                from: twelveAMFri,
                description: expect.any(String),
                id: expect.any(String),
            }
        ];
        const thursAvailability: Array<AvailabilityType> = [
            {
                mES: 10,
                pES: 50,
                length: TimeInMillis.Hour,
                from: fiveAMThurs,
                description: expect.any(String),
                id: expect.any(String),
            },
            {
                mES: 5,
                pES: 75,
                length: 2 * TimeInMillis.Hour,
                from: sevenAMThurs,
                description: expect.any(String),
                id: expect.any(String),
            },
            {
                mES: 89,
                pES: 5,
                length: 1.5 * TimeInMillis.Hour,
                from: elevenAMThurs,
                                description: expect.any(String),
                id: expect.any(String),
            }
        ];
    });
    describe('add', () => {
        it('it returns null if and only if the added timeslot overlaps with an existing timeslot', () => {
            const tslotId = scheduler.add(av);
            expect(tslotId).not.toBeNull();

            const aMinuteFromNow = now + TimeInMillis.Minute;
            const conflictingAv = {
                from: aMinuteFromNow,
                length: TimeInMillis.Hour,
                mES: 30,
                pES: 70,
            };
            const result = scheduler.add(conflictingAv);

            expect(result).toBeNull();
        });
        const now = new Date().getTime();
        const av: AvailabilityType = {
            from: now,
            length: TimeInMillis.Hour,
            mES: 50,
            pES: 50,
        };
        beforeEach(() => {
            scheduler.clear();
        });
    });
    describe('schedule', () => {
        it("returns null if no timeslot can be found to satisfy the current task", () => {
            const withInsatiableMES: TaskType = taskWith({ mES: maxMES + 1 });
            expect(scheduler.schedule(withInsatiableMES)).toBeNull();

            const withInsatiablePES: TaskType = taskWith({ pES: maxPES + 1 });
            expect(scheduler.schedule(withInsatiablePES)).toBeNull();

            const withInsatiableLength: TaskType = taskWith({ length: longestTime + 1 });
            expect(scheduler.schedule(withInsatiableLength)).toBeNull();
        });
        it("returns the schedule item within which the task task was added", () => {
            const medianLength = (shortestTime + longestTime) / 2;
            const withMedianLength: TaskType = taskWith({ length: medianLength });
            const scheduleWLongestTimeslot: ScheduleItemType = {
                timeslot: {
                    ...wedAvailability[1],
                    id: expect.any(Number),
                },
                tasks: expect.any(Array<TaskType>),
            }

            const medLenResult = scheduler.schedule(withMedianLength);
            expect(medLenResult).toStrictEqual(scheduleWLongestTimeslot);

            const lessThanMinLength = shortestTime / 2;
            const withLessThanMinLength: TaskType = taskWith({ length: lessThanMinLength });
            const scheduleWShortestTimeslot: ScheduleItemType = {
                timeslot: {
                    ...wedAvailability[0],
                    id: expect.any(Number),
                },
                tasks: expect.any(Array<TaskType>),
            }

            const shortLenResult = scheduler.schedule(withLessThanMinLength);
            expect(shortLenResult).toStrictEqual(scheduleWShortestTimeslot);
        });
        it("returns null if the timeslot which could satisfy the task has been used", () => {
            scheduler.clear(); // to ensure the av doesn't conflict with any old avs
            const someTslot = wedAvailability[1];
            scheduler.add(someTslot);

            const aTaskWhichCompletelyFillsTslot: TaskType = {
                ...someTslot,
            };

            const resultOnFirstTaskSchedule = scheduler.schedule(aTaskWhichCompletelyFillsTslot);
            expect(resultOnFirstTaskSchedule).not.toBeNull();


            const anotherTask: TaskType = {
                length: 100,
                mES: 10,
                pES: 10,
            };
            const resultOnNoFreeTslot = scheduler.schedule(anotherTask);
            expect(resultOnNoFreeTslot).toBeNull();
        });
        beforeEach(() => {
            scheduler.clear();
            wedAvailability.forEach(av => {
                const result = scheduler.add(av);
                expect(result).not.toBeNull();
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
    const scheduler = new Scheduler();
    const elevenPMWed = getTime(2023, 1, 1, 23);
    const onePMWed = getTime(2023, 1, 1, 13);
    const wedAvailability: Array<AvailabilityType> = [
        {
            mES: 34,
            pES: 21,
            length: 0.5 * TimeInMillis.Hour,
            from: elevenPMWed,
        },
        {
            mES: 55,
            pES: 89,
            length: 2 * TimeInMillis.Hour,
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
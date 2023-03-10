
import { describe, it, expect, beforeEach } from 'vitest';
import { AvailabilityDS, type AvailabilityType } from '../helpers';

describe('AvailabilityDS Test', () => {
    const avd = new AvailabilityDS();
    describe('getAvailabilityForDay', () => {
        const anHourInMillis = 1_000 * 60 * 60;
        const fiveAMThurs = getTime(2023, 1, 2, 5);
        const sevenAMThurs = getTime(2023, 1, 2, 7);
        const elevenAMThurs = getTime(2023, 1, 2, 11);
        const elevenPMWed = getTime(2023, 1, 1, 23);
        const onePMWed = getTime(2023, 1, 1, 13);
        const twelveAMFri = getTime(2023, 1, 3);
        const thursAvailability: Array<AvailabilityType> = [
            {
                mES: 10,
                pES: 50,
                length: anHourInMillis,
                from: fiveAMThurs,
            },
            {
                mES: 5,
                pES: 75,
                length: 2 * anHourInMillis,
                from: sevenAMThurs,
            },
            {
                mES: 89,
                pES: 5,
                length: 1.5 * anHourInMillis,
                from: elevenAMThurs,
            }
        ];
        const wedAvailability: Array<AvailabilityType> = [
            {
                mES: 34,
                pES: 21,
                length: 0.5 * anHourInMillis,
                from: elevenPMWed,
            },
            {
                mES: 2,
                pES: 89,
                length: 2 * anHourInMillis,
                from: onePMWed,
            },
        ];
        const friAvailability: Array<AvailabilityType> = [
            {
                mES: 89,
                pES: 34,
                length: 6 * anHourInMillis,
                from: twelveAMFri,
            }
        ];
        it('returns an empty array given a day with no availability', () => {
            const aSaturdayWithNoAvailability = new Date(2023, 1, 4);
            const availability = avd.getAvailabilityForDay(aSaturdayWithNoAvailability)
            expect(availability).toHaveLength(0);
        });
        it('returns the availability within the given day', () => {
            const wedThursNFriAvailability = wedAvailability.concat(thursAvailability).concat(friAvailability);
            shuffleArray(wedThursNFriAvailability);
            wedThursNFriAvailability.forEach(value => avd.addAvailability(value));
            const thursday = new Date(2023, 1, 2);

            const comparator = (a: AvailabilityType, b: AvailabilityType) => a.from - b.from;
            const availability = avd.getAvailabilityForDay(thursday).sort(comparator);

            expect(availability).toStrictEqual(thursAvailability.sort(comparator));
        });
    });
    describe('addAvailability', () => {
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
    });
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
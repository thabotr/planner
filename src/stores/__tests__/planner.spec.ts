import { TimeInMillis } from "@/middleware/helpers";
import DescriptiveItemType from "@/types/DescriptiveItemType";
import { beforeEach, describe, expect, it, test } from "vitest";
import { usePlannerStore } from "../planner";
import { faker } from '@faker-js/faker';
import { setActivePinia, createPinia } from 'pinia'
import TimedItemTypeWithTasks from "@/types/TimedItemTypeWithTasks";
import ScheduledDescriptiveItemType from "@/types/ScheduledDescriptiveItemType";

describe('Planner', () => {
    let planner: ReturnType<typeof usePlannerStore>;
    beforeEach(() => {
        setActivePinia(createPinia());
        planner = usePlannerStore();
    });
    describe('updateTimeslot', () => {
        const plannerHasOneTimeslot = () => planner.getTimeslots().length === 1;
        let existingTslot: TimedItemTypeWithTasks;
        beforeEach(() => {
            planner.clearAll();
            const partialTslot = new TimedItemTypeWithTasks(
                '', TimeInMillis.Hour, 10, 10, TimeInMillis.Day, [],
            );
            const tslotCreated = planner.createTimeslot(partialTslot);
            expect(tslotCreated).toBeTruthy();

            expect(plannerHasOneTimeslot()).toBeTruthy();
            [existingTslot] = planner.getTimeslots();
        });
        test('given a timeslot with a new length and new start time such that the ' +
            'timeslot does not intersect with any other existing timeslot and ' +
            'effort capacity which allows its scheduled tasks to fit then ' +
            'the timeslot should be correctly updated and true should be returned', () => {
                const updatedTimeslot = new TimedItemTypeWithTasks(
                    existingTslot.id, 2 * TimeInMillis.Hour, 20, 30, TimeInMillis.Day, [],
                );

                const updated = planner.updateTimeslot(updatedTimeslot);
                expect(updated).toBeTruthy();
                expect(plannerHasOneTimeslot()).toBeTruthy();
                expect(planner.getTimeslots()).toContain(updatedTimeslot);
            },
        );
        test('given a timeslot with a new length such that the timeslot intersects ' +
            'with an existing timeslot then it should return false without updating ' +
            'the timeslot', () => {
                const lengthOfNewTslot = 10 * TimeInMillis.Minute;
                const startTimeOfNewTslot = existingTslot.startTime - 2 * lengthOfNewTslot;
                const anotherTimeslotBeforeExistingTimeslot = new TimedItemTypeWithTasks(
                    '', lengthOfNewTslot, 10, 10, startTimeOfNewTslot, [],
                );
                const created = planner.createTimeslot(anotherTimeslotBeforeExistingTimeslot);
                expect(created).toBeTruthy();

                const newIntersectingLength = 3 * lengthOfNewTslot;
                const updatedTslot = new TimedItemTypeWithTasks(
                    anotherTimeslotBeforeExistingTimeslot.id,
                    newIntersectingLength,
                    10,
                    10,
                    startTimeOfNewTslot,
                    [],
                );
                const updated = planner.updateTimeslot(updatedTslot);

                expect(updated).toBeFalsy();
            },
        );
        test('given a timeslot with a mES effort less than that required by all ' +
            'scheduled tasks then it should return false without updating the timeslot', () => {
                const tasksWithOverflowMES = [
                    new ScheduledDescriptiveItemType('', 10 * TimeInMillis.Minute, 0, 10, 'desc', 0),
                    new ScheduledDescriptiveItemType('', 10 * TimeInMillis.Minute, 0, 10, 'desc', 2_000),
                ];
                const mESOverCapacitedTslot = new TimedItemTypeWithTasks(
                    '', TimeInMillis.Hour, 10, 10, 0, tasksWithOverflowMES,
                );

                const updated = planner.updateTimeslot(mESOverCapacitedTslot);

                expect(updated).toBeFalsy();
            },
        );
        test('given a timeslot with a pES effort less than that required by all ' +
            'scheduled tasks then it should return false without updating the timeslot', () => {
                const tasksWithOverflowPES = [
                    new ScheduledDescriptiveItemType('', 10 * TimeInMillis.Minute, 20, 10, 'desc', 0),
                    new ScheduledDescriptiveItemType('', 10 * TimeInMillis.Minute, 20, 10, 'desc', 2_000),
                ];
                const pESOverCapacitedTslot = new TimedItemTypeWithTasks(
                    '', TimeInMillis.Hour, 10, 10, 0, tasksWithOverflowPES,
                );

                const updated = planner.updateTimeslot(pESOverCapacitedTslot);

                expect(updated).toBeFalsy();
            },
        );
    });
    describe('updateTask', () => {
        it('updates the existing task', () => {
            const partialTask = new DescriptiveItemType(
                '', TimeInMillis.Hour, 10, 10, faker.hacker.phrase(),
            );
            planner.createTask(partialTask);

            const plannerHasOneTask = () => planner.getTasks().length === 1;
            expect(plannerHasOneTask()).toBeTruthy();

            const task = planner.getTasks()[0];
            const updatedTask = new DescriptiveItemType(
                task.id, TimeInMillis.Minute, 20, 20, faker.hacker.phrase(),
            );
            planner.updateTask(updatedTask);
            expect(plannerHasOneTask()).toBeTruthy();

            expect(planner.getTasks()).toContain(updatedTask);
        });
    });
    describe('createTask', () => {
        it('adds a task into the store and assigns it an id', () => {
            const partialTask = new DescriptiveItemType(
                '', TimeInMillis.Hour, 10, 10, faker.hacker.phrase(),
            );
            const plannerHasNoTasks = planner.getTasks().length === 0;
            expect(plannerHasNoTasks).toBeTruthy();

            planner.createTask(partialTask);

            const plannerHasOneTask = planner.getTasks().length === 1;
            expect(plannerHasOneTask).toBeTruthy();

            const addedTask = planner.getTasks()[0];
            expect(addedTask.description).toBe(partialTask.description);
            expect(addedTask.id).toMatch(/^\d+$/);
        });
    });
    describe('createTimeslot', () => {
        beforeEach(() => {
            planner = usePlannerStore();
        });
        it('given a timeslot which does not collide with others then it adds the ' +
            'timeslot into the store, assigns it an id and returns true', () => {
                const plannerHasNoTimeslots = planner.getTimeslots().length === 0;
                expect(plannerHasNoTimeslots).toBeTruthy();

                const partialTslot = new TimedItemTypeWithTasks('', TimeInMillis.Hour, 10, 10, TimeInMillis.Day, []);
                const tslotCreated = planner.createTimeslot(partialTslot);
                expect(tslotCreated).toBeTruthy();

                const plannerHasOneTimeslot = () => planner.getTimeslots().length === 1;
                expect(plannerHasOneTimeslot()).toBeTruthy();
            },
        );
        it('given a timeslot which intersects with any existing timeslot then it should just ' +
            'return false without adding the timeslot into the store', () => {
                const existingTslotStart = 10;
                const existingTslotSpan = 20;
                const partialTslot = new TimedItemTypeWithTasks(
                    '', existingTslotSpan, 10, 10, existingTslotStart, [],
                );
                const tslotCreated = planner.createTimeslot(partialTslot);
                expect(tslotCreated).toBeTruthy();

                const tslotStartCollide = new TimedItemTypeWithTasks(
                    '', existingTslotSpan, 10, 10, existingTslotStart + existingTslotSpan / 2, [],
                );
                expect(planner.createTimeslot(tslotStartCollide)).toBeFalsy();
                const tslotEndCollide = new TimedItemTypeWithTasks(
                    '', existingTslotSpan, 10, 10, existingTslotStart - existingTslotSpan / 2, [],
                );
                expect(planner.createTimeslot(tslotEndCollide)).toBeFalsy();
                const tslotBoundsAnotherTslot = new TimedItemTypeWithTasks(
                    '', 2 * existingTslotSpan, 10, 10, existingTslotStart - existingTslotSpan / 2, [],
                );
                expect(planner.createTimeslot(tslotBoundsAnotherTslot)).toBeFalsy();
            },
        );
    });
    describe('scheduleTask', () => {
        it('returns false when the given id has no corresponding task in the store', () => {
            const idForInexistentTask = '404';
            const scheduled = planner.scheduleTask(idForInexistentTask);
            expect(scheduled).toBeFalsy();
        });
        it('finds the nearest timeslot with enough capacity to schedule the task, ' +
            'schedules it into that timeslot and returns true', () => {
                const allTimeslots = [
                    new TimedItemTypeWithTasks('', 100, 10, 10, 0, []),
                    new TimedItemTypeWithTasks('', 100, 20, 20, 200, []),
                ];
                allTimeslots.forEach(planner.createTimeslot);

                const allTimeslotsCreated = planner.getTimeslots().length === allTimeslots.length;
                expect(allTimeslotsCreated).toBeTruthy();

                const partialTaskToSchedule = new DescriptiveItemType('', 10, 10, 20, 'hello');
                planner.createTask(partialTaskToSchedule);
                const [taskToSchedule] = planner.getTasks();

                expect(planner.unscheduledTasks).toContain(taskToSchedule);

                const scheduled = planner.scheduleTask(taskToSchedule.id);
                expect(scheduled).toBeTruthy();

                expect(planner.unscheduledTasks).not.toContain(taskToSchedule);
            },
        );
    });
    describe('get => unscheduledTasks', () => {
        it('returns all the tasks that are not scheduled in any timeslots', () => {
            const allTasks = [
                new DescriptiveItemType('', 10, 10, 10, 'desc 1'),
                new DescriptiveItemType('', 10, 10, 10, 'desc 2'),
                new DescriptiveItemType('', 10, 10, 10, 'desc 3'),
            ];

            allTasks.forEach(planner.createTask);
            const allTasksCreated = planner.getTasks().length === allTasks.length;
            expect(allTasksCreated).toBeTruthy();

            const [_, oneOfUnscheduledTasks] = planner.getTasks();
            expect(planner.unscheduledTasks).toContain(oneOfUnscheduledTasks);

            const tslotWithTaskCreated = planner.createTimeslot(
                new TimedItemTypeWithTasks('', 100, 10, 10, 0, [
                    new ScheduledDescriptiveItemType(
                        oneOfUnscheduledTasks.id,
                        oneOfUnscheduledTasks.length,
                        oneOfUnscheduledTasks.pES,
                        oneOfUnscheduledTasks.mES,
                        oneOfUnscheduledTasks.description,
                        0,
                    ),
                ]),
            );
            expect(tslotWithTaskCreated).toBeTruthy();

            expect(planner.unscheduledTasks).not.toContain(oneOfUnscheduledTasks);
        });
    });
    describe.skip('deleteTimeslot', () => {
        it('removes the timeslot from the store', () => {

        });
        it('unschedules all the tasks in the deleted timeslot', () => {

        });
    });
    describe.skip('deleteTask', () => {
        it('removes the task from the store', () => {

        });
    });
})
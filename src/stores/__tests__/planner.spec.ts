import { TimeInMillis } from "@/middleware/helpers";
import DescriptiveItemType from "@/types/DescriptiveItemType";
import { beforeEach, describe, expect, it } from "vitest";
import { usePlannerStore } from "../planner";
import { faker } from '@faker-js/faker';
import { setActivePinia, createPinia } from 'pinia'
import TimedItemTypeWithTasks from "@/types/TimedItemTypeWithTasks";

describe('Planner', () => {
    let planner: ReturnType<typeof usePlannerStore>;
    beforeEach(() => {
        setActivePinia(createPinia());
        planner = usePlannerStore();
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

                const plannerOneNoTimeslot = () => planner.getTimeslots().length === 1;
                expect(plannerOneNoTimeslot()).toBeTruthy();
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
})
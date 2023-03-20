import { TimeInMillis } from "@/middleware/helpers";
import DescriptiveItemType from "@/types/DescriptiveItemType";
import { beforeEach, describe, expect, it } from "vitest";
import { usePlannerStore } from "../planner";
import { faker } from '@faker-js/faker';
import { setActivePinia, createPinia } from 'pinia'

describe('Planner', () => {
    let planner: ReturnType<typeof usePlannerStore>;
    beforeEach(() => {
        setActivePinia(createPinia());
        planner = usePlannerStore();
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
})
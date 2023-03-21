import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type DescriptiveItemType from '@/types/DescriptiveItemType';
import type TimedItemTypeWithTasks from '@/types/TimedItemTypeWithTasks';
import type TimedItemType from '@/types/TimedItemType';
import ItemType from '@/types/ItemType';
import ScheduledDescriptiveItemType from '@/types/ScheduledDescriptiveItemType';

export const usePlannerStore = defineStore('planner', () => {
    const id = ref<number>(0);
    const tasks = ref<Array<DescriptiveItemType>>([]);
    const timeslots = ref<Array<TimedItemTypeWithTasks>>([]);

    const unscheduledTasks = computed<Array<DescriptiveItemType>>(() => {
        const scheduledTasks = timeslots.value.flatMap(
            (timeslot) => timeslot.scheduledTasks
        );
        return tasks.value.filter(
            (task) => !scheduledTasks.some((scheduledTask) => scheduledTask.id === task.id)
        );
    });

    function scheduleTask(taskId: string): boolean {
        const task = tasks.value.find(tsk => tsk.id === taskId);
        if (!task) { return false; }
        const appropriateTslot = timeslots.value.find(tslot => !isInOverflow(tslot, task));
        if (!appropriateTslot) { return false; }
        const taskScheduledAt = appropriateTslot.startTime +
            appropriateTslot.scheduledTasks
                .map(tsk => tsk.length)
                .reduce((a, b) => a + b, 0);
        const scheduledTask = new ScheduledDescriptiveItemType(
            task.id,
            task.length,
            task.pES,
            task.mES,
            task.description,
            taskScheduledAt,
        );
        appropriateTslot.scheduledTasks.push(scheduledTask);
        return true;
    }


    function getTasks(): Array<DescriptiveItemType> {
        return tasks.value;
    }

    function createTask(idLessTask: DescriptiveItemType) {
        const newTask = { ...idLessTask, id: id.value.toString() };
        tasks.value.push(newTask);
        id.value++;
    }

    function updateTask(existingTask: DescriptiveItemType) {
        const index = tasks.value.findIndex(task => task.id === existingTask.id);
        if (index > -1) {
            tasks.value.splice(index, 1, existingTask);
        }
    }

    function clearAll() {
        tasks.value = [];
        timeslots.value = [];
    }

    function updateTimeslot(timeslot: TimedItemTypeWithTasks): boolean {
        if (intersectsWithOtherTimeslots(timeslot)) {
            return false;
        }

        if (isInOverflow(timeslot)) {
            return false;
        }

        const index = timeslots.value.findIndex(tslot => tslot.id === timeslot.id);
        if (index > -1) {
            timeslots.value.splice(index, 1, timeslot);
            return true;
        }
        return false;
    }

    function isInOverflow(timeslot: TimedItemTypeWithTasks, withTask?: ItemType): boolean {
        const effortSum = timeslot.scheduledTasks.reduce((acc: ItemType, task: ItemType) => {
            acc.length += task.length;
            acc.mES += task.mES;
            acc.pES += task.pES;
            return acc;
        }, withTask ?? new ItemType(0, 0, 0, ''));

        // TODO factor in current time into this overflow calculation

        return (
            effortSum.length > timeslot.length ||
            effortSum.pES > timeslot.pES ||
            effortSum.mES > timeslot.mES
        );
    }

    function createTimeslot(idLessTimeslot: TimedItemTypeWithTasks): boolean {
        // TODO prevent timeslots created before now()
        const newTimeslot = { ...idLessTimeslot, id: id.value.toString() };
        if (intersectsWithOtherTimeslots(newTimeslot)) {
            return false;
        }
        timeslots.value.push(newTimeslot);
        id.value++;
        return true;
    }

    function intersectsWithOtherTimeslots(newTimeslot: TimedItemType): boolean {
        for (let i = 0; i < timeslots.value.length; i++) {
            const otherTimeslot = timeslots.value[i];
            if (newTimeslot.id === otherTimeslot.id) {
                continue;
            }

            if (
                (otherTimeslot.startTime >= newTimeslot.startTime &&
                    otherTimeslot.startTime < newTimeslot.startTime + newTimeslot.length) ||
                (newTimeslot.startTime >= otherTimeslot.startTime &&
                    newTimeslot.startTime < otherTimeslot.startTime + otherTimeslot.length)
            ) {
                return true;
            }
        }
        return false;
    }

    function getTimeslots(): Array<TimedItemTypeWithTasks> {
        return timeslots.value;
    }

    return {
        getTasks,
        createTask,
        createTimeslot,
        getTimeslots,
        updateTask,
        updateTimeslot,
        clearAll,
        scheduleTask,
        unscheduledTasks,
    };
});
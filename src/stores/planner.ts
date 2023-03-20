import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type DescriptiveItemType from '@/types/DescriptiveItemType';
import type TimedItemTypeWithTasks from '@/types/TimedItemTypeWithTasks';

export const usePlannerStore = defineStore('planner', () => {
    const id = ref<number>(0);
    const tasks = ref<Array<DescriptiveItemType>>([]);
    const timeslots = ref<Array<TimedItemTypeWithTasks>>([]);

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

    function createTimeslot(idLessTimeslot: TimedItemTypeWithTasks): boolean {
        const newTimeslot = { ...idLessTimeslot, id: id.value.toString() };
        for (let i = 0; i < timeslots.value.length; i++) {
            const otherTimeslot = timeslots.value[i];
            if (
                (otherTimeslot.startTime >= newTimeslot.startTime &&
                    otherTimeslot.startTime < newTimeslot.startTime + newTimeslot.length) ||
                (newTimeslot.startTime >= otherTimeslot.startTime &&
                    newTimeslot.startTime < otherTimeslot.startTime + otherTimeslot.length)
            ) {
                return false;
            }
        }
        timeslots.value.push(newTimeslot);
        id.value++;
        return true;
    }

    function getTimeslots(): Array<TimedItemTypeWithTasks> {
        return timeslots.value;
    }

    return { getTasks, createTask, createTimeslot, getTimeslots, updateTask };
});
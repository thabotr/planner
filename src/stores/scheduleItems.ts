import type { TaskType, AvailabilityType } from "@/middleware/helpers";
import { defineStore } from "pinia";

export const useScheduleItemsStore = defineStore('scheduleItems', {
    state: () => ({
        tasks: new Map<string, TaskType>(),
        nextId: 1,
        taskIdsForTimeslots: new Map<string, Set<string>>(),
        timeslots: new Map<string, AvailabilityType>(),
    }),
    getters: {
        timeslotTasks(state) {
            return (timeslotId: string): TaskType[] => {
                const taskIds = state.taskIdsForTimeslots.get(timeslotId) ?? new Set<string>();
                const tslotTasks: TaskType[] = [];

                taskIds.forEach(taskId => {
                    const task = state.tasks.get(taskId);
                    task && tslotTasks.push(task);
                });
                return tslotTasks;
            };
        },
        unscheduledTasks(state): TaskType[] {
            const idsForScheduledTasks: string[] = Array.from(state.taskIdsForTimeslots.values())
                .flatMap(setOfIds => Array.from(setOfIds.values()));
            return Array.from(state.tasks.values()).filter(({ id }) => !idsForScheduledTasks.includes(id));
        }
    },
    actions: {
        addTask(partialTask: Omit<TaskType, 'id'>) {
            const _1 = this.nextId++;
            const taskId = _1.toString();
            this.tasks.set(taskId, { ...partialTask, id: taskId });
        },
        removeTask(taskId: string) {
            this.tasks.delete(taskId);
        },
        timeslotAddTask(timeslotId: string, taskId: string) {
            this.taskIdsForTimeslots.get(timeslotId)?.add(taskId);
        },
        timeslotRemoveTask(timeslotId: string, taskId: string) {
            this.taskIdsForTimeslots.get(timeslotId)?.delete(taskId);
        },
        addTimeslot(partialTimeslot: Omit<AvailabilityType, 'id'>) {
            const _1 = this.nextId++;
            const tslotId = _1.toString();
            this.timeslots.set(tslotId, { ...partialTimeslot, id: tslotId });
            this.taskIdsForTimeslots.set(tslotId, new Set<string>());
        },
        removeTimeslot(timeslotId: string) {
            this.taskIdsForTimeslots.delete(timeslotId);
            this.timeslots.delete(timeslotId);
        }
    }
})
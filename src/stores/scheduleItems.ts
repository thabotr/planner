import { type TaskType, type AvailabilityType, Scheduler, TimeInMillis, type ScheduleItemType } from "@/middleware/helpers";
import { defineStore } from "pinia";

const scheduler = new Scheduler();

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
        timeslotAddTask(taskId: string, timeslotId?: string): boolean {
            const task = this.$state.tasks.get(taskId);
            if (!task) {
                throw new Error(`Task ${taskId} not found`);
            }

            const schRes = scheduler.schedule(task);
            if (!schRes) {
                return false;
            }

            this.taskIdsForTimeslots.get(schRes.timeslotId)?.add(taskId);
            return true;
        },
        timeslotRemoveTask(timeslotId: string, taskId: string) {
            this.taskIdsForTimeslots.get(timeslotId)?.delete(taskId);
        },
        addTimeslot(partialTimeslot: Omit<AvailabilityType, 'id'>): boolean {
            const addTslotRes = scheduler.add({ ...partialTimeslot, id: "" });
            if (addTslotRes === null) { return false; }
            const _1 = this.nextId++;
            const tslotId = _1.toString();
            this.timeslots.set(tslotId, { ...partialTimeslot, id: tslotId });
            this.taskIdsForTimeslots.set(tslotId, new Set<string>());
            return true;
        },
        removeTimeslot(timeslotId: string) {
            this.taskIdsForTimeslots.delete(timeslotId);
            this.timeslots.delete(timeslotId);
        },
        getScheduleOn(day: Date): ScheduleItemType[] {
            return scheduler.getScheduleOn(day);
        }
    }
})
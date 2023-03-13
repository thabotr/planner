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
        },
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
        timeslotAddTask(taskId: string): boolean {
            const task = this.$state.tasks.get(taskId);
            if (!task) {
                throw new Error(`Task ${taskId} not found`);
            }

            for (const timeslot of this.timeslots.values()) {
                const tslotCapacity = this._timeslotGetRemainingCapacity(timeslot.id);
                const taskFitsIntoTimeslot = this._taskFitsInRemainingCapacity(task, tslotCapacity);
                if (!taskFitsIntoTimeslot) {
                    continue;
                }
                const taskIdsForTimeslot = this.taskIdsForTimeslots.get(timeslot.id);
                if (!taskIdsForTimeslot) {
                    throw new Error(`no tasks for timeslot ${timeslot.id}`);
                }
                taskIdsForTimeslot.add(task.id);
                return true;
            }

            return false;
        },
        timeslotRemoveTask(timeslotId: string, taskId: string) {
            this.taskIdsForTimeslots.get(timeslotId)?.delete(taskId);
        },
        addTimeslot(partialTimeslot: Omit<AvailabilityType, 'id'>): boolean {
            if (this._overlapsWithSomeTimeslot(partialTimeslot)) { return false; }
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
        },
        updateTask(task: TaskType) {
            this.tasks.set(task.id, task);
        },
        getTask(taskId: string) {
            return this.tasks.get(taskId);
        },
        _overlapsWithSomeTimeslot(newTslot: Omit<AvailabilityType, 'id'>): boolean {
            for (const timeslot of this.timeslots.values()) {
                const newTslotStartContainedInTslot = timeslot.from <= newTslot.from &&
                    newTslot.from <= timeslot.from + timeslot.length;
                const newTslotEndContainedInTslot = timeslot.from <= newTslot.from + newTslot.length &&
                    newTslot.from + newTslot.length <= timeslot.from + timeslot.length;
                const newTslotContainsTslot = newTslot.from <= timeslot.from &&
                    timeslot.from <= newTslot.from + newTslot.length;
                const overlaps = newTslotStartContainedInTslot || newTslotEndContainedInTslot ||
                    newTslotContainsTslot;
                if (overlaps) {
                    return true;
                }
            }
            return false;
        },
        _timeslotGetRemainingCapacity(timeslotId: string): TimeslotCapacityType {
            const timeslot = this.timeslots.get(timeslotId);
            if (!timeslot) {
                return {
                    length: 0,
                    mES: 0,
                    pES: 0,
                };
            }
            const remainingCapacity: TimeslotCapacityType = {
                ...timeslot,
            };

            const idsForTasks = this.taskIdsForTimeslots.get(timeslotId);
            if (!idsForTasks) {
                return remainingCapacity;
            }

            for (const taskId of idsForTasks) {
                const task = this.tasks.get(taskId);
                if (!task) {
                    throw new Error(`timeslotGetRemainingCapacity: failed to get task ${taskId}`);
                }
                remainingCapacity.length -= task.length;
                remainingCapacity.mES -= task.mES;
                remainingCapacity.pES -= task.pES;
            }

            return remainingCapacity;
        },
        _taskFitsInRemainingCapacity(task: TaskType, capacity: TimeslotCapacityType): boolean {
            return task.length <= capacity.length && task.mES <= capacity.mES &&
                task.pES <= capacity.pES;
        },
    }
})

type TimeslotCapacityType = Omit<AvailabilityType, 'id' | 'description' | 'from'>;
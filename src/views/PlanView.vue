<template>
    <div id="main-container">
        <div id="calendar-ctnr">
            <CalendarVue @click-date="changeDayOnView" />
        </div>
        <div id="day-schedule-ctnr">
            <PreviewDaySchedule @schedule="scheduleTask" :timeslots="dayTimeslots"
                @edit="tslot => edit('timeslot', tslot)" />
        </div>
        <div id="unscheduled-tasks-ctnr">
            <UnscheduledTaskCard v-for="task in unscheduledTasks" :item="task" @delete="() => onDelete('task', task)"
                @edit="() => edit('task', task)" />
        </div>
        <div id="todo-ctnr">
            <TodoTaskGroup :scheduled-task="nearestScheduledTask" @unschedule="unscheduleTask" @done="markAsDone" />
        </div>
        <CreateItemGroup class="fab" @create-task="() => newItem('task')" @create-timeslot="() => newItem('timeslot')" />
        <v-dialog :model-value="!!itemInEdit" persistent>
            <div class="flex-horizontal centered-content" v-if="itemInEdit">
                <TimeslotEditCard v-if="itemInEdit.type === 'timeslot'" :timeslot="itemInEdit.item"
                    @delete="() => itemInEdit && onDelete('timeslot', itemInEdit.item)" @cancel="close"
                    @save="item => saveEdit({ type: 'timeslot', tslot: item })" />
                <TaskEditCard v-else :task="itemInEdit.item" @delete="() => itemInEdit && onDelete('task', itemInEdit.item)"
                    @cancel="close" @save="item => saveEdit({ type: 'task', task: item })" />
            </div>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { toast, type ToastOptions } from 'vue3-toastify';
import CreateItemGroup from '@/components/CreateItemGroup.vue';
import TodoTaskGroup from '@/components/Task/TodoTaskGroup.vue';
import UnscheduledTaskCard from '@/components/Task/UnscheduledTaskCard.vue';
import DescriptiveItemType from '@/types/DescriptiveItemType';
import PreviewDaySchedule from '@/components/PreviewDaySchedule.vue';
import TimedItemTypeWithTasks from '@/types/TimedItemTypeWithTasks';
import CalendarVue from '@/components/Calendar.vue';
import type ItemType from '@/types/ItemType';
import TimeslotEditCard from '@/components/TimeslotEditCard.vue';
import TaskEditCard from '@/components/Task/TaskEditCard.vue';
import { usePlannerStore } from '@/stores/planner';
import { nowInMs } from '@/middleware/helpers';

const plannerStore = usePlannerStore();
const {
    deleteTask,
    deleteTimeslot,
    markTaskAsDone,
    createTask,
    createTimeslot,
    updateTask,
    updateTimeslot,
    scheduleTask: plannerScheduleTask,
} = plannerStore;

const {
    nearestScheduledTask,
    timeslotsInRange,
    unscheduledTasks,
} = storeToRefs(plannerStore);

const dateOnView = ref<Date>(new Date());
const dayTimeslots = computed(() => {
    const dayStart = new Date(
        dateOnView.value.getFullYear(), dateOnView.value.getMonth(), dateOnView.value.getDate(),
    ).getTime();
    const dayEnd = new Date(
        dateOnView.value.getFullYear(), dateOnView.value.getMonth(), dateOnView.value.getDate() + 1,
    ).getTime();
    return timeslotsInRange.value(dayStart, dayEnd);
});
const itemInEdit = ref<
    { type: 'task', item: DescriptiveItemType } |
    { type: 'timeslot', item: TimedItemTypeWithTasks } | undefined>();

function changeDayOnView(date: Date) { dateOnView.value = date; }

function scheduleTask(unscheduledTask: DescriptiveItemType) {
    const scheduled = plannerScheduleTask(unscheduledTask.id);
    if (!scheduled) {
        toast.error('No timeslot available to schedule task', { autoClose: 2000, } as ToastOptions);
    }
}

function onDelete(type: 'timeslot' | 'task', item: ItemType) {
    switch (type) {
        case 'task':
            deleteTask(item.id);
            break;
        case 'timeslot':
            deleteTimeslot(item.id);
            break;
    }
    close();
}

function close() {
    itemInEdit.value = undefined;
}

function unscheduleTask(task: ItemType) {
    // TODO re-calculate scheduled tasks starttime
    // TODO implement planner unscheduleTask
}

function markAsDone(task: ItemType) { markTaskAsDone(task.id); }

function saveEdit(
    item: { type: 'task', task: DescriptiveItemType } |
    { type: 'timeslot', tslot: TimedItemTypeWithTasks },
) {
    switch (item.type) {
        case 'task':
            if (item.task.id) {
                updateTask(item.task);
                break;
            }
            createTask(item.task);
            break;
        case 'timeslot':
            if (item.tslot.id) {
                // TODO handle failures
                updateTimeslot(item.tslot);
                break;
            }
            // TODO handle failures
            createTimeslot(item.tslot);
            break;
    }
    close();
}

function edit(type: 'task' | 'timeslot', item: DescriptiveItemType | TimedItemTypeWithTasks) {
    console.log('editing item', type, item);
    switch (type) {
        case 'task':
            itemInEdit.value = {
                type: 'task',
                item: item as DescriptiveItemType,
            };
            break;
        case 'timeslot':
            itemInEdit.value = {
                type: 'timeslot',
                item: item as TimedItemTypeWithTasks,
            };
            break;
    }
}

function newItem(type: 'task' | 'timeslot') {
    switch (type) {
        case 'task':
            itemInEdit.value = {
                type: 'task',
                item: new DescriptiveItemType('', 0, 0, 0, ''),
            };
            return;
        case 'timeslot':
            itemInEdit.value = {
                type: 'timeslot',
                item: new TimedItemTypeWithTasks('', 0, 0, 0, nowInMs(), []),
            };
            return;
    }
}

</script>

<style scoped>
#main-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, 1fr);
    grid-template-areas:
        "a a b c"
        "a a b c"
        "a a d c"
        "a a d c"
        "a a d c"
    ;
    gap: 1rem;
    position: relative;
}

#unscheduled-tasks-ctnr {
    grid-area: a;
    height: 80vh;
    border: 1px solid black;
    overflow-y: scroll;
    border-radius: 0.5rem;
}

@media (min-width: 1024px) {
    #unscheduled-tasks-ctnr {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5px;
        padding: 5px;
    }
}

#calendar-ctnr {
    grid-area: b;
}

#day-schedule-ctnr {
    grid-area: c;
}

#todo-ctnr {
    grid-area: d;
}

@media (max-width: 1024px) {
    #main-container {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        grid-template-areas:
            "a b c"
            "a d c"
            "a d c"
        ;
    }
}

@media (max-width: 480px) {
    #main-container {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(3, 1fr);
        grid-template-areas:
            "d"
            "d"
            "a"
        ;
    }

    #day-schedule-ctnr,
    #calendar-ctnr {
        display: none;
        /* display these in a dialog using action from nav */
    }
}

.fab {
    position: absolute;
    right: 1%;
    bottom: 2%;
}

.v-btn {
    background-color: transparent;
    color: var(--color-primary);
}

#todo {
    position: relative;
}

#card {
    position: absolute;
    left: 0;
    right: 0;
}
</style>
<template>
    <div id="main-container">
        <div id="calendar-ctnr">
            <CalendarVue @click-date="drop" />
        </div>
        <div id="day-schedule-ctnr">
            <PreviewDaySchedule @schedule="drop" :timeslots="[
                new TimedItemTypeWithTasks(
                    '19', 67 * TimeInMillis.Minute, 60, 80, new Date().getTime() - 9 * TimeInMillis.Minute, [
                    new ScheduledDescriptiveItemType(
                        '', TimeInMillis.Hour, 10, 10, 'described here', new Date().getTime() - 9 * TimeInMillis.Minute,
                    ),
                ]
                ),
                new TimedItemTypeWithTasks(
                    '21', 27 * TimeInMillis.Minute, 30, 70, new Date().getTime() + 90 * TimeInMillis.Minute, [
                    new ScheduledDescriptiveItemType(
                        '', TimeInMillis.Hour, 10, 10, 'described here', new Date().getTime(),
                    ),
                ]
                )
            ]" />
        </div>
        <div id="unscheduled-tasks-ctnr">
            <UnscheduledTaskCard v-for="task in unscheduledTasks" :item="task" />
        </div>
        <div id="todo-ctnr">
            <TodoTaskGroup :scheduled-task="
                new ScheduledDescriptiveItemType(
                    'id', TimeInMillis.Hour, 10, 20, 'task desc', new Date().getTime() + 1 * TimeInMillis.Minute,
                )
            " />
        </div>
        <CreateItemGroup class="fab" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CreateItemGroup from '@/components/CreateItemGroup.vue';
import TodoTaskGroup from '@/components/Task/TodoTaskGroup.vue';
import UnscheduledTaskCard from '@/components/Task/UnscheduledTaskCard.vue';
import { TimeInMillis } from '@/middleware/helpers';
import DescriptiveItemType from '@/types/DescriptiveItemType';
import ScheduledDescriptiveItemType from '@/types/ScheduledDescriptiveItemType';
import TimedItemType from '@/types/TimedItemType';
import PreviewDaySchedule from '@/components/PreviewDaySchedule.vue';
import TimedItemTypeWithTasks from '@/types/TimedItemTypeWithTasks';
import CalendarVue from '@/components/Calendar.vue';
const v = new TimedItemType("id", 10, 10, 10, 167_000_000);

// function onSave(event: DescriptiveItemType) {
//     console.log("on save called", event);
// }

const unscheduledTasks = ref<DescriptiveItemType[]>([
    new DescriptiveItemType('17', 15 * TimeInMillis.Minute, 10, 30, 'a description over here'),
    new DescriptiveItemType('27', 27 * TimeInMillis.Minute, 50, 20, 'another desc another desc another desc another desc another desc'),
    new DescriptiveItemType('11', 27 * TimeInMillis.Minute, 50, 20, 'another desc another desc another desc another desc another desc'),
]);

function drop(t: any) {
    console.log('schedule', t);
}

function onDelete() {
    console.log("on delete called");
}
</script>

<style scoped>
/* #cal {
    width: 10rem;
    height: 10rem;
}

#cal * {
    width: 100%;
    height: 100%;
} */

#main-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-template-areas:
        "a a b c"
        "a a d c"
        "a a d c"
    ;
    gap: 1rem;
    position: relative;
}

#unscheduled-tasks-ctnr {
    grid-area: a;
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

/* #active-task {
    grid-area: b;
} */
</style>
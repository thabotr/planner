
<template>
    <div id="main-container">
        <div id="calendar-ctnr" class="hlt-1">
            
        </div>
        <div id="day-schedule-ctnr" class="hlt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, hic.
        </div>
        <div id="unscheduled-tasks-ctnr" class="hlt-3">

        </div>
        <div id="todo-ctnr" class="hlt-4">

        </div>
        <CreateItemGroup class="fab"/>
    </div>
</template>

<script setup lang="ts">
import CreateItemGroup from '@/components/CreateItemGroup.vue';
</script>

<style scoped>
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
</style>
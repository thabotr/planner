<template>
    <div class="row">
        <v-calendar show-weeknumbers :attributes="attributes" @dayclick="dayOnView = $event.date">
        </v-calendar>
        <DaySchedule :items="dayScheduleItems" :dayOnView="dayOnView" />
    </div>
    <v-btn id="create-availability" icon="mdi-timeline-plus" @click="openDialog" />
    <v-dialog v-model="addingAvailability" transition="dialog-bottom-transition" persistent>
        <AvailabilityEditor @close="closeDialog" @created="onAvailabilityCreated" />
    </v-dialog>
</template>

<script lang="ts">
import { Scheduler, toSubjectiveEffortScore, verboseTimestamp } from '@/middleware/helpers';
import type { ScheduleItemType, AvailabilityType } from '@/middleware/helpers';
import AvailabilityEditor from './AvailabilityEditor.vue';
import DaySchedule from './DaySchedule.vue';
import Slider from './Slider.vue';

const scheduler = new Scheduler();

export default {
    components: {
        Slider: Slider,
        DaySchedule: DaySchedule,
        AvailabilityEditor: AvailabilityEditor,
    },
    data() {
        return {
            addingAvailability: false,
            dayOnView: new Date(),
            mentalEffort: 0,
            physicalEffort: 0,
            dayScheduleItems: [] as ScheduleItemType[],
        }
    },
    computed: {
        attributes() {
            const todayAndDayOnviewMarkers = [
                {
                    key: "today",
                    highlight: {
                        fillMode: 'outline',
                    },
                    dates: new Date(),
                },
                {
                    key: "dayOnView",
                    highlight: true,
                    dates: this.dayOnView,
                }
            ];
            const availabilityPerDayMarkers = this.dayScheduleItems.map(({ timeslot }) => {
                const mEP = toSubjectiveEffortScore(timeslot.mES);
                const pEP = toSubjectiveEffortScore(timeslot.pES);
                const time = verboseTimestamp(timeslot.length);
                return {
                    key: timeslot.from.toString(),
                    dates: timeslot.from,
                    popover: {
                        label: `xx/${mEP} mEP yy/${pEP} pEP tt/${time} T [scheduled/available]`,
                    },
                    bar: "red",
                }
            });
            const allAttributes = [...todayAndDayOnviewMarkers, ...availabilityPerDayMarkers];
            return allAttributes;
        }
    },
    methods: {
        openDialog() { this.addingAvailability = true; },
        closeDialog() { this.addingAvailability = false; },
        onAvailabilityCreated(timeslot: AvailabilityType) {
            // TODO error on overlap
            scheduler.add(timeslot);
            const now = new Date();
            const todayStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            this.dayScheduleItems = scheduler.getScheduleOn(todayStartTime);
        }
    },
    watch: {
        dayOnView(newDay: Date) {
            this.dayScheduleItems = scheduler.getScheduleOn(newDay);
        }
    }
}
</script>

<style scoped>
#create-availability {
    background-image: linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);
    position: absolute;
    left: 10%;
    bottom: 10%;
}

.v-dialog {
    width: 50%;
}
</style>
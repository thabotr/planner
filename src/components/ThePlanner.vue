<template>
    <div class="row">
        <v-calendar show-weeknumbers :attributes="attributes" @dayclick="dayOnView = $event.date">
        </v-calendar>
        <DaySchedule :items="dayScheduleItems" :dayOnView="dayOnView" @requesttaskschedule="onRequestTaskSchedule" />
    </div>
    <v-btn id="create-availability" icon="mdi-timeline-plus" @click="openDialog" />
    <v-dialog v-model="addingAvailability" transition="dialog-bottom-transition" persistent>
        <AvailabilityEditor @close="closeDialog" @created="onAvailabilityCreated" />
    </v-dialog>
</template>

<script lang="ts">
import { toSubjectiveEffortScore, verboseTimestamp, type TaskType } from '@/middleware/helpers';
import type { ScheduleItemType, AvailabilityType } from '@/middleware/helpers';
import AvailabilityEditor from './AvailabilityEditor.vue';
import DaySchedule from './DaySchedule.vue';
import Slider from './Slider.vue';
import { useScheduleItemsStore } from '../stores/scheduleItems';
import { mapActions, mapState } from 'pinia';

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
            const availabilityPerDayMarkers = Array.from(this.timeslots.values()).map(timeslot => {
                const mEP = toSubjectiveEffortScore(timeslot.mES);
                const pEP = toSubjectiveEffortScore(timeslot.pES);
                const time = verboseTimestamp(timeslot.length);
                return {
                    key: timeslot.from.toString(),
                    dates: timeslot.from,
                    popover: {
                        label: `xx/${mEP} mEP yy/${pEP} pEP tt/${time} T [scheduled/available]`,
                    },
                    bar: "green",
                }
            });
            const allAttributes = [...todayAndDayOnviewMarkers, ...availabilityPerDayMarkers];
            return allAttributes;
        },
        ...mapState(useScheduleItemsStore, ['timeslots']),
    },
    methods: {
        openDialog() { this.addingAvailability = true; },
        closeDialog() { this.addingAvailability = false; },
        onAvailabilityCreated(timeslot: AvailabilityType) {
            const created = this.addTimeslot(timeslot);
            if (!created) {
                this.$emit(
                    "error",
                    {
                        type: "Timeslot creation failed",
                        message: "The new timeslot should not overlap with an existing timeslot",
                    }
                );
                return;
            }
            this.updateDaySchedule();
        },
        onRequestTaskSchedule(task: TaskType) {
            const scheduled = this.timeslotAddTask(task.id);
            if (!scheduled) {
                this.$emit(
                    "error",
                    {
                        type: "Task scheduling failed",
                        message: "No suitable timeslot was found to schedule this task",
                    }
                );
                return;
            }
            this.updateDaySchedule();
        },
        updateDaySchedule() {
            const now = new Date();
            const todayStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            this.dayScheduleItems = this.getScheduleOn(todayStartTime);
        },
        ...mapActions(useScheduleItemsStore, ['addTimeslot', 'getScheduleOn', 'timeslotAddTask']),
    },
    watch: {
        dayOnView(newDay: Date) {
            this.dayScheduleItems = this.getScheduleOn(newDay);
        }
    },
    emits: ['error'],
}
</script>

<style scoped>
#create-availability {
    background-image: linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);
    position: fixed;
    left: 60%;
    bottom: 5%;
}

.v-dialog {
    width: 50%;
}
</style>
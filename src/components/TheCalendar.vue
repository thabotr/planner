<template>
    <div class="row">
        <v-calendar show-weeknumbers :attributes="attributes" @dayclick="dayOnView=$event.date" />
        <DaySchedule :availability="availability" :dayOnView="dayOnView" />
    </div>
    <v-btn id="create-availability" icon="mdi-timeline-plus" @click="openDialog" />
    <v-dialog v-model="editingCalendarItem" transition="dialog-bottom-transition" persistent>
        <div class="row">
            <div id="date-picker">
                <v-date-picker v-model="range" is-range mode="dateTime" />
            </div>
            <v-card class="row padded">
                <Slider custom-color="purple" icon="mdi-brain" v-model="mentalEffort"
                    :human-readable-effort-value="mentalEffortScore" step="10" direction="vertical" />
                <Slider custom-color="#EED202" icon="mdi-account-hard-hat" v-model="physicalEffort"
                    :human-readable-effort-value="physicalEffortScore" step="10" direction="vertical" />
                <Slider icon="mdi-timer" direction="vertical" disabled custom-color="red"
                    :human-readable-effort-value="temporalInvestmentStamp" model-value="50" />
            </v-card>
        </div>
        <div class="row">
            <v-btn prepend-icon="mdi-close" @click="discardEntry">Discard</v-btn>
            <v-btn prepend-icon="mdi-progress-check" @click="saveAvailabilityEntry" color="green">Save</v-btn>
        </div>
    </v-dialog>
</template>

<script lang="ts">
import { getRandomTime, toSubjectiveEffortScore, toTimeStamp } from '@/middleware/helpers';
import DaySchedule from './DaySchedule.vue';
import Slider from './Slider.vue';

type AvailabilityType = {
    mentalEffort: number,
    physicalEffort: number,
    temporalInvestment: number,
    fromTime: number,
};

export default {
    components: {
        Slider: Slider,
        DaySchedule
    },
    data() {
        return {
            editingCalendarItem: false,
            range: {
                start: new Date(),
                end: new Date()
            },
            dayOnView: new Date(),
            mentalEffort: 0,
            physicalEffort: 0,
            availability: [] as AvailabilityType[],
        }
    },
    computed: {
        mentalEffortScore() { return toSubjectiveEffortScore(this.mentalEffort); },
        physicalEffortScore() { return toSubjectiveEffortScore(this.physicalEffort); },
        temporalInvestmentStamp() {
            const diffInMs = this.range.end.getTime() - this.range.start.getTime();
            return toTimeStamp(diffInMs);
        },
        attributes() {
            return [
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
            ]
        }
    },
    methods: {
        saveAvailabilityEntry() {
            const timeInvestment = this.range.end.getTime() - this.range.start.getTime();
            const availability = {
                mentalEffort: this.mentalEffort,
                physicalEffort: this.physicalEffort,
                temporalInvestment: timeInvestment,
                fromTime: this.range.start.getTime(),
            };
            this.availability.push(availability);
            this.closeDialog();
            this.restoreDefaults();
        },
        discardEntry() {
            this.closeDialog();
            this.restoreDefaults();
        },
        openDialog() { this.editingCalendarItem = true; },
        closeDialog() { this.editingCalendarItem = false; },
        restoreDefaults() {
            this.range = {
                start: new Date(),
                end: new Date()
            };
            this.mentalEffort = 0;
            this.physicalEffort = 0;
        },
        getMillisElapsedInLatestDay(timestampInMillis: number): number {
            const aDayInMillis = 1_000 * 60 * 60 * 24;
            return timestampInMillis % aDayInMillis;
        },
        // setDateOnView({date} : {date: Date}) {
        //     console.log(date);
        // }
    },
}
</script>

<style scoped>
#create-availability {
    background-image: linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);
    position: absolute;
    left: 10%;
    bottom: 10%;
}

.row {
    display: flex;
    flex-direction: row;
    gap: 3rem;
}

.v-dialog {
    width: 50%;
}
</style>
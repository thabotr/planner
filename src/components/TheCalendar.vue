<template>
    <v-calendar is-expanded show-weeknumbers :attributes="attributes" />
    <v-card id="day-schedule" ref="schedule">
        <div class="centered-content">
            <strong>{{ new Date().toDateString() }}</strong>
        </div>
        <v-timeline side="end" ref="timeline">
            <v-timeline-item hide-dot>
                <div style="background-color: red; width: 3rem; height: 1rem;">

                </div>
                <template v-slot:opposite>
                    00:00
                </template>
            </v-timeline-item>
            <template v-for="i in 95">
                <v-timeline-item dot-color="blue" icon="mdi-calendar" :hide-dot="i !== Math.round((new Date().getMinutes() / 60 + new Date().getHours()) * 4)">
                    <template v-slot:opposite>
                        {{ i / 4 < 10 ? `0${Math.floor(i / 4)}` : Math.floor(i / 4) }}:{{ ((i % 4) * 15) === 0 ? `00` : (i %
                            4) * 15 }} </template>
                </v-timeline-item>
            </template>
            <v-timeline-item hide-dot>
                <template v-slot:opposite>
                    00:00
                </template>
            </v-timeline-item>
        </v-timeline>
    </v-card>
    <v-btn id="create-availability" icon="mdi-timeline-plus" @click="openDialog" />
    <v-dialog v-model="editingCalendarItem" transition="dialog-bottom-transition" persistent>
        <div class="row">
            <div id="date-picker">
                <v-date-picker v-model="range" is-range mode="dateTime" :attributes="attributes" />
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
import { toSubjectiveEffortScore, toTimeStamp, getRandomTime } from '@/middleware/helpers';
import type { ComponentPublicInstance } from 'vue';
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
    },
    data() {
        return {
            editingCalendarItem: false,
            range: {
                start: new Date(),
                end: new Date()
            },
            mentalEffort: 0,
            physicalEffort: 0,
            attributes: [
                {
                    key: "today",
                    highlight: {
                        fillMode: 'outline',
                    },
                    dates: new Date(),
                },
            ],
            availability: [] as AvailabilityType[],
        }
    },
    computed: {
        mentalEffortScore() { return toSubjectiveEffortScore(this.mentalEffort); },
        physicalEffortScore() { return toSubjectiveEffortScore(this.physicalEffort); },
        temporalInvestmentStamp() {
            const diffInMs = this.range.end.getTime() - this.range.start.getTime();
            return toTimeStamp(diffInMs);
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
    },
    created() {
        //add fake availability
        this.availability.push(
            {
                mentalEffort: 3,
                physicalEffort: 0,
                temporalInvestment: getRandomTime(),
                fromTime: new Date().getTime(),
            }
        );
        const oneHourInMillis = 1_000 * 60 * 60;
        this.availability.push(
            {
                mentalEffort: 8,
                physicalEffort: 13,
                temporalInvestment: getRandomTime(),
                fromTime: new Date().getTime() + oneHourInMillis,
            }
        );
    },
    mounted() {
        const timelineComponent = this.$refs.timeline as ComponentPublicInstance;
        const element: HTMLElement = timelineComponent.$el;
        const ratioOfMinsElapsedInDay = (new Date().getMinutes() + new Date().getHours() * 60) / (60 * 24);
        const timelineOffsetHeight = ratioOfMinsElapsedInDay * element.scrollHeight;
        const scheduleComponent = this.$refs.schedule as ComponentPublicInstance;
        const scheduleElem: HTMLElement = scheduleComponent.$el;
        const scheduleCenterOffset = scheduleElem.scrollHeight / 2;
        const scrollDest = Math.max(0, timelineOffsetHeight - scheduleCenterOffset);
        element.scrollTo({
            top: scrollDest,
            behavior: 'auto',
        });
    }
}
</script>

<style scoped>
#day-schedule {
    width: 20rem;
    height: 20rem;
}

#create-availability {
    background-image: linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);
    position: absolute;
    right: 1rem;
    bottom: 1rem;
}

.row {
    display: flex;
    flex-direction: row;
    gap: 3rem;
}

.v-dialog {
    width: 50%;
}

.v-timeline {
    overflow-y: scroll;
}

.padded {
    padding: 1rem;
}
</style>
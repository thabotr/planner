<template>
    <v-calendar show-weeknumbers :attributes="attributes" />
    <v-card id="schedule-container" class="padded">
        <template v-slot:title>{{ new Date().toDateString() }}</template>
        <v-card id="day-schedule" ref="schedule" class="vertical-scroll">
            <div>
                <v-list id="timeline" ref="timeline">
                    <v-divider id="timeIndicator" ref="timeIndicator" :thickness="3" color="blue"
                        style="z-index: 9999;"></v-divider>
                    <li class="timeline-item" :min-start="0" :min-end="15">
                        <span>00:00</span>
                        <div class="event-placeholder"></div>
                    </li>
                    <li class="timeline-item" v-for="i in 95" :min-start="i * 15" :min-end="(i + 1) * 15">
                        <span>
                            {{ i / 4 < 10 ? `0${Math.floor(i / 4)}` : Math.floor(i / 4) }}:{{ ((i % 4) * 15) === 0 ? `00` : (i
                                % 4) * 15 }} </span>
                                <div class="event-placeholder"></div>
                    </li>
                </v-list>
            </div>
        </v-card>
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
        moveTimeIndicatorToCurrentTimeInTheSchedule() {
            const currentIndicatorPositionBelowScheduleTop = this.getCurrentTimePositionBelowScheduleTop();
            const timeIndicator: HTMLElement = (this.$refs.timeIndicator as ComponentPublicInstance).$el;
            timeIndicator.style.top = `${currentIndicatorPositionBelowScheduleTop}px`;
        },
        getCurrentTimePositionBelowScheduleTop() {
            const currTimeInMins = new Date().getMinutes() + new Date().getHours() * 60;
            const minStart = Math.floor(currTimeInMins / 15) * 15;
            const timelineItem: HTMLElement | null = document.querySelector(`[min-start="${minStart}"]`);
            if (timelineItem === null) { return 0; }
            const proportionIntoTimelineItem = (currTimeInMins / 15) % 1;
            const heightBelowTimelineItemTop = Math.round(proportionIntoTimelineItem * timelineItem.scrollHeight);
            return heightBelowTimelineItemTop + timelineItem.offsetTop;
        },
        scrollScheduleToTheCurrentTime() {
            const currentIndicatorPositionBelowScheduleTop = this.getCurrentTimePositionBelowScheduleTop();
            const schedule: HTMLElement = (this.$refs.schedule as ComponentPublicInstance).$el;
            const halfScheduleClientHeight = schedule.clientHeight / 2;
            schedule.scrollTo({
                top: currentIndicatorPositionBelowScheduleTop - halfScheduleClientHeight,
                behavior: 'auto',
            });
        },
        getHeightRelativeToTheSchedule(timeInMillis: number) {
            const scheduleHeightInMillis = 1_000 * 60 * 60 * 24;
            const proportionOfTimeWithinSchedule = timeInMillis / scheduleHeightInMillis;
            const schedule: HTMLElement = (this.$refs.schedule as ComponentPublicInstance).$el;
            return Math.floor(proportionOfTimeWithinSchedule * schedule.scrollHeight);
        },
        getMillisElapsedInLatestDay(timestampInMillis: number): number {
            const aDayInMillis = 1_000 * 60 * 60 * 24;
            return timestampInMillis % aDayInMillis;
        }
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
        this.moveTimeIndicatorToCurrentTimeInTheSchedule();
        this.scrollScheduleToTheCurrentTime();
        const aDayInMillis = 1_000 * 60 * 60 * 24;

        // mark availability into calendar
        const example = this.availability[0];
        const millisStart = this.getMillisElapsedInLatestDay(example.fromTime);
        const fromMins = Math.floor(millisStart / (1_000 * 60));
        const minStart = fromMins - fromMins % 15;
        const startEventSlot: HTMLElement | null = document.querySelector(`[min-start="${minStart}"] > .event-placeholder`);
        if (startEventSlot === null) { return; }
        const startOffsetTop = 60 * (millisStart % (15*1_000*60*60)) / aDayInMillis;
        const temporalInvestmentTillMidnight = millisStart + example.temporalInvestment > aDayInMillis ? aDayInMillis - millisStart : example.temporalInvestment;
        const availabilityHeight = this.getHeightRelativeToTheSchedule(temporalInvestmentTillMidnight);
        startEventSlot.innerHTML = `
                <div style="width: 0.5rem; height: ${availabilityHeight}px; top: ${startOffsetTop}px; background-color: orange; position: absolute; z-index: 99;">
                    </div>`
    },
}
</script>

<style scoped>
#day-schedule {
    width: 15rem;
    height: 20rem;
}

#schedule-container {
    width: 17rem;
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

.vertical-scroll {
    overflow-y: scroll;
}

.padded {
    padding: 1rem;
}

.event-placeholder {
    width: 10rem;
    height: 60px;
    border: 1px solid gray;
}

#timeline {
    background-color: #79b2f479;
}

.timeline-item span {
    margin-top: -0.8rem;
}

.timeline-item {
    display: grid;
    grid-template-columns: 1fr 4fr;
}

#schedule-current-time-indicator {
    top: 0px;
}
</style>
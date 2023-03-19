<template>
    <v-card class="fill-parent">
        <template #title>Day Schedule</template>
        <template #subtitle>{{ dayOnViewString }}</template>
        <ul id="timeslot-container">
            <v-divider id="current-time-marker" thickness="5" ref="current-time-marker" />
            <li v-for="i in 95">
                {{ markerTime(i) }}
            </li>
            <div v-for="tslot in timeslots" :id="`preview-day-schedule-timeslot-${tslot.id}`" class="timeslot">
                <TimeslotPreviewCard :timeslot="tslot" :usage="getTimeslotUsage(tslot)" class="fill-parent"
                    @edit="$emit('edit', tslot)" />
            </div>
        </ul>
    </v-card>
</template>

<script lang="ts">
import type { CreateComponentPublicInstance } from 'vue';
import { dateFromMs, nowInMs, millisSinceStartOfDay, TimeInMillis } from '@/middleware/helpers';
import type TimedItemTypeWithTasks from '@/types/TimedItemTypeWithTasks';
import TimeslotPreviewCard from './PreviewDaySchedule/TimeslotPreviewCard.vue';
import ItemType from '@/types/ItemType';

export default {
    emits: ['edit'],
    props: {
        timeslots: { type: Array<TimedItemTypeWithTasks>, required: true, },
    },
    data() {
        return {
            dayOnView: nowInMs(),
        }
    },
    methods: {
        getTimeslotUsage(timeslot: TimedItemTypeWithTasks): ItemType {
            const identityTask = new ItemType(0, 0, 0, '');
            const items = timeslot.scheduledTasks
                .map(stask => new ItemType(stask.length, stask.mES, stask.pES, ''))
                .concat(identityTask);
            const totalUsage = items.reduce((a, b) => new ItemType(
                a.length + b.length, a.mES + b.mES, a.pES + b.pES, '',
            ));
            return totalUsage;
        },
        markerTime(nth15minsInDay: number): string {
            const hours = Math.floor(nth15minsInDay / 4);
            const mins = nth15minsInDay % 4 * 15;
            const zeroPad = (interval: number): string => {
                return `${interval < 10 ? '0' : ''}`.concat(interval.toString());
            };
            return `${zeroPad(hours)}:${zeroPad(mins)}`;
        },
        placeCurrentTimeMarkerInCorrectPosition() {
            const timeslotContainer = document.getElementById('timeslot-container') as HTMLElement;
            const marker = (
                this.$refs['current-time-marker'] as CreateComponentPublicInstance
            ).$el as HTMLElement;

            // show marker
            marker.style.color = 'red';

            //move marker to correct position
            const dayMillis = millisSinceStartOfDay();
            const tslotCntnrHeight = timeslotContainer.scrollHeight;
            const markerTopAtHeight = dayMillis / TimeInMillis.Day * tslotCntnrHeight;

            marker.style.top = `${markerTopAtHeight}px`;
        },
        containerRelativeHeight(millis: number): string {
            const timeslotContainer = document.getElementById('timeslot-container') as HTMLElement;
            const tslotCntnrHeight = timeslotContainer.scrollHeight;
            const height = millis / TimeInMillis.Day * tslotCntnrHeight;
            return `${height}px`;
        },
        sizeAndPlaceTimeslotsInCorrectPosition() {
            for (const timeslot of this.timeslots) {
                const timeslotElem = document.getElementById(
                    `preview-day-schedule-timeslot-${timeslot.id}`
                ) as HTMLElement;
                timeslotElem.style.height = this.containerRelativeHeight(timeslot.length);
                const timeslotStart = millisSinceStartOfDay(timeslot.startTime);
                timeslotElem.style.top = this.containerRelativeHeight(timeslotStart);
            }
        }
    },
    computed: {
        dayOnViewString(): string {
            return dateFromMs(this.dayOnView).toLocaleString(
                undefined,
                { hour12: false, day: '2-digit', month: "short", year: 'numeric', weekday: 'long' },
            );
        }
    },
    mounted() {
        this.placeCurrentTimeMarkerInCorrectPosition();
        this.sizeAndPlaceTimeslotsInCorrectPosition();
    },
    components: { TimeslotPreviewCard },
}
</script>

<style scoped>
.v-card {
    background-color: transparent;
    border: 1px solid var(--color-accent);
    height: 80vh;
    overflow-y: scroll;
}

li {
    height: 60px;
    border-top: 1px solid gray;
    color: gray;
}

ul {
    position: relative;
}

#current-time-marker {
    position: absolute;
    width: 100%;
    z-index: 2;
}

.timeslot {
    position: absolute;
    width: 100%;
    z-index: 1;
    top: 0;
    padding: 0.2rem;
    padding-left: 2.5rem;
    border-radius: 0.5rem;
    border: 2px dashed var(--color-accent);
}
</style>
<template>
    <v-card class="fill-parent" @drop="onDrop" @dragover.prevent @dragenter.prevent>
        <template #title>Day Schedule</template>
        <template #subtitle>{{ dayOnViewString }}</template>
        <ul id="timeslot-container">
            <v-divider id="current-time-marker" thickness="5" ref="current-time-marker" />
            <li v-for="i in 96">{{ markerTime(i - 1) }}</li>
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
import type DescriptiveItemType from '@/types/DescriptiveItemType';

export default {
    emits: ['edit', 'schedule',],
    props: {
        timeslots: { type: Array<TimedItemTypeWithTasks>, required: true, },
    },
    data() {
        return {
            dayOnView: nowInMs(),
            interval: undefined as number | undefined,
        }
    },
    methods: {
        onDrop(event: DragEvent) {
            if (!event.dataTransfer) {
                return;
            }
            const unscheduledTask: DescriptiveItemType = JSON.parse(
                event.dataTransfer.getData('unscheduledTask'),
            );
            this.$emit('schedule', unscheduledTask);
        },
        getTimeslotUsage(timeslot: TimedItemTypeWithTasks): ItemType {
            const totalUsage = timeslot.scheduledTasks.reduce((acc, item) => {
                acc.length += item.length;
                acc.mES += item.mES;
                acc.pES += item.pES;
                return acc;
            }, new ItemType(0, 0, 0, ''));
            const unusableLength = Math.abs(Math.min(timeslot.startTime - nowInMs(), 0));
            totalUsage.length = Math.min(totalUsage.length + unusableLength, timeslot.length);
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
        placeCurrentTimeMarkerInCorrectPosition(): { markerTopAtHeight: number, scheduleClientHeight: number } {
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

            return {
                markerTopAtHeight: markerTopAtHeight,
                scheduleClientHeight: timeslotContainer.clientHeight,
            };
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
        const offsets = this.placeCurrentTimeMarkerInCorrectPosition();
        this.sizeAndPlaceTimeslotsInCorrectPosition();
        this.interval = setInterval(() => {
            this.placeCurrentTimeMarkerInCorrectPosition();
        }, TimeInMillis.Minute);
        const timeslotContainer = document.getElementById('timeslot-container') as HTMLElement;
        timeslotContainer.scrollTo({
            top: Math.max(offsets.markerTopAtHeight - offsets.scheduleClientHeight / 3, 0),
            behavior: 'smooth',
        });
    },
    unmounted() {
        clearInterval(this.interval);
    },
    components: { TimeslotPreviewCard },
    updated() {
        this.placeCurrentTimeMarkerInCorrectPosition();
        this.sizeAndPlaceTimeslotsInCorrectPosition();
    }
}
</script>

<style scoped>
.v-card {
    background-color: transparent;
}

li {
    height: 60px;
    border-top: 1px solid gray;
    color: gray;
}

ul {
    position: relative;
    height: 70vh;
    overflow-y: scroll;
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
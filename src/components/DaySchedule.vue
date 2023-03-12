<template>
    <v-card id="schedule-container" class="padded" @drop="onDropTask" @dragover.prevent @dragenter.prevent>
        <template v-slot:title>{{ dayOnView.toDateString() }}</template>
        <v-card id="schedule" ref="schedule" class="vertical-scroll padded">
            <div>
                <canvas id="timeline" :width="canvasWidth" :height="canvasHeight">
                </canvas>
            </div>
            <div id="items-holder" ref="itemsHolder"
                :style="{ height: canvasHeight + 'px', width: 200 - canvasWidth + 'px' }">
                <template v-for="{ timeslot, tasks } in items">
                    <div id="scheduled-availability-item"
                        :style="{ width: '100%', height: getHeightRelativeToSchedule(timeslot), top: getHeightOfTimeIntoDay(timeslot) }">
                        <div class="availability-item-bg centered-content">
                            {{ timeslot.mES }} mEP {{ timeslot.pES }} pEP {{
                                Math.round(timeslot.length / (1_000 * 60)) }} mins
                        </div>
                        <div id="scheduled-items">
                            <PlanItemInTimeslot v-for="task in tasks" :id="task.id" :mental-effort="task.mES" :physical-effort="task.pES" :temporal-investment="task.length" readonly/>
                        </div>
                    </div>
                </template>
            </div>
        </v-card>
    </v-card>
</template>

<script lang="ts">
import type { CreateComponentPublicInstance } from 'vue';

import { TimeInMillis } from '@/middleware/helpers';
import type { TaskType, ScheduleItemType, AvailabilityType as TimeslotType } from '@/middleware/helpers';
import PlanItemInTimeslot from './PlanItemInTimeslot.vue';

export default {
    props: {
        items: {
            type: Array<ScheduleItemType>,
            required: true,
        },
        dayOnView: {
            type: Date,
            required: true,
        },
    },
    data() {
        return {
            fifteenMinCellHeight: 60,
            canvasWidth: 30,
            now: new Date().getTime(),
            updaterInterval: -1,
        };
    },
    computed: {
        canvasHeight() {
            const minsInADay = 24 * 60;
            const numberEventSlots = (minsInADay / 15);
            return numberEventSlots * this.fifteenMinCellHeight;
        },
        currentDayCanvasOffset() {
            const oneDayInMillis = 1_000 * 60 * 60 * 24;
            const zoneOffset = 2 * 60 * 60 * 1_000;
            const currentTimeMillis = (this.now + zoneOffset) % oneDayInMillis;
            return currentTimeMillis / oneDayInMillis * this.canvasHeight;
        },
        ctx() {
            const canvas = document.getElementById("timeline") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d");
            if (ctx === null) {
                throw new Error("Canvas has no context");
            }
            return ctx;
        },
    },
    methods: {
        onDropTask(event: DragEvent) {
            if (!event.dataTransfer) throw new Error("DragEvent contains not data franster object on drop");
            const taskAsString = event.dataTransfer.getData('task');
            const task: TaskType & {id: String} = JSON.parse(taskAsString);
            this.$emit("requesttaskschedule", task);
        },
        scrollScheduleToTheCurrentTime() {
            const currentIndicatorPositionBelowScheduleTop = this.currentDayCanvasOffset;
            const schedule: HTMLElement = (this.$refs.schedule as CreateComponentPublicInstance).$el;
            const halfScheduleClientHeight = schedule.clientHeight / 2;
            schedule.scrollTo({
                top: currentIndicatorPositionBelowScheduleTop - halfScheduleClientHeight,
                behavior: 'auto',
            });
        },
        zeroPad(num: number): string {
            return num < 10 ? `0${num}` : num.toString();
        },
        drawCurrentTimeMarkerInSchedule(ctx: CanvasRenderingContext2D) {
            ctx.beginPath();
            ctx.strokeStyle = 'blue';
            ctx.moveTo(0, this.currentDayCanvasOffset);
            ctx.lineTo(this.canvasWidth, this.currentDayCanvasOffset);
            ctx.lineTo(this.canvasWidth - 8, this.currentDayCanvasOffset + 3);
            ctx.lineTo(this.canvasWidth - 8, this.currentDayCanvasOffset - 3);
            ctx.lineTo(this.canvasWidth, this.currentDayCanvasOffset);
            ctx.stroke();
        },
        drawScheduleTimeline(ctx: CanvasRenderingContext2D) {
            const fifteenMinCellHeight = 60;
            const numberOfIntervalsInAday = 4 * 24;
            for (let i = 0; i < numberOfIntervalsInAday; ++i) {
                ctx.beginPath();
                ctx.strokeStyle = "gray";
                ctx.moveTo(0, fifteenMinCellHeight * i);
                ctx.lineTo(this.canvasWidth, fifteenMinCellHeight * i);
                ctx.stroke();
                const hours = Math.floor(i / 4);
                const minutes = (i % 4) * 15;
                const timeMarkString = [hours, minutes].map(this.zeroPad).join(':');
                ctx.beginPath();
                ctx.fillStyle = 'black';
                ctx.fillText(timeMarkString, 0, fifteenMinCellHeight * i + 10);
            }
        },
        getHeightRelativeToSchedule(timeslot: TimeslotType): string {
            return `${timeslot.length / TimeInMillis.Day * this.canvasHeight}px`;
        },
        getHeightOfTimeIntoDay(timeslot: TimeslotType): string {
            const zoneOffset = 2 * 60 * 60 * 1_000;
            const availabilityStartInSchedule = (timeslot.from % TimeInMillis.Day + zoneOffset) / TimeInMillis.Day * this.canvasHeight;
            return `${availabilityStartInSchedule}px`;
        },
    },
    mounted() {
        this.drawScheduleTimeline(this.ctx);
        this.drawCurrentTimeMarkerInSchedule(this.ctx);
        this.scrollScheduleToTheCurrentTime();
    },
    watch: {
        dayOnView(currDayOnView: Date) {
            const today = new Date();
            const todayIsOnView = currDayOnView.getFullYear() === today.getFullYear() &&
                currDayOnView.getMonth() === today.getMonth() && currDayOnView.getDate() === today.getDate();
            // redraw all
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.drawScheduleTimeline(this.ctx);
            if (todayIsOnView) {
                // enable current time indicator
                this.drawCurrentTimeMarkerInSchedule(this.ctx);
                this.scrollScheduleToTheCurrentTime();
            }
        },
    },
    components: {
        PlanItemInTimeslot: PlanItemInTimeslot,
    }
}
</script>

<style scope>
@import url(../assets/main.css);

#timeline {
    background-color: #79b2f479;
}

#schedule {
    height: 80vh;
    display: flex;
}

#items-holder {
    flex: 1;
    background-color: #79b2f437;
}

.availability-item-bg {
    color: rgba(0, 126, 0, 0.3);
    background-image: repeating-linear-gradient(45deg, rgba(0, 126, 0, 0.258) 0, rgba(0, 126, 0, 0.258) 1px, rgba(0, 126, 0, 0.1) 0, rgba(0, 126, 0, 0.1) 5%);
    height: 100%;
    width: 100%;
}

#scheduled-items {
    position: absolute;
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    display: flex;
    gap: 1rem;
}
</style>
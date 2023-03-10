<template>
    <v-card id="schedule-container" class="padded" @drop="onDropTask" @dragover.prevent @dragenter.prevent>
        <template v-slot:title>{{ dayOnView.toDateString() }}</template>
        <v-card id="schedule" ref="schedule" class="vertical-scroll padded">
            <div>
                <canvas id="timeline" :width="canvasWidth" :height="canvasHeight">
                </canvas>
            </div>
            <div id="items-holder" :style="{ height: canvasHeight + 'px' }">
            </div>
        </v-card>
    </v-card>
</template>

<script lang="ts">
import type { CreateComponentPublicInstance } from 'vue';

type AvailabilityType = {
    mentalEffort: number,
    physicalEffort: number,
    temporalInvestment: number,
    fromTime: number,
};

export default {
    props: {
        availability: {
            type: Array<AvailabilityType>,
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
        availabilityForDayOnView() {
            const todayStartTime = new Date(this.dayOnView.getFullYear(), this.dayOnView.getMonth(), this.dayOnView.getDate()).getTime();
            const tomorrowStartDate = new Date(this.dayOnView.getFullYear(), this.dayOnView.getMonth(), this.dayOnView.getDate());
            tomorrowStartDate.setDate(tomorrowStartDate.getDate() + 1);
            const tomorrowStartTime = tomorrowStartDate.getTime();
            const todaysAV = this.availability.filter(av => av.fromTime >= todayStartTime && av.fromTime < tomorrowStartTime);
            console.log(tomorrowStartTime - todayStartTime);
            return todaysAV;
        }
    },
    methods: {
        onDropTask(event: DragEvent) {
            if (!event.dataTransfer) throw new Error("DragEvent contains not data franster object on drop");
            console.log("item dropped ", event.dataTransfer.getData("id"));
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
            ctx.lineTo(this.canvasWidth-8, this.currentDayCanvasOffset + 3);
            ctx.lineTo(this.canvasWidth-8, this.currentDayCanvasOffset - 3);
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
        displayAvailability(ctx: CanvasRenderingContext2D) {
            const aDayInMillis = 1_000 * 60 * 60 * 24;
            const getPlaceholderColor = (function* () {
                while (true) {
                    yield '#ff00ff4f';
                    yield '#1aff004f';
                    yield '#ffe1004f';
                }
            })();
            const zoneOffset = 2 * 60 * 60 * 1_000;
            for (const example of this.availabilityForDayOnView) {
                const availabilityStartInSchedule = (zoneOffset + example.fromTime % aDayInMillis) / aDayInMillis * this.canvasHeight;
                const span = example.temporalInvestment / aDayInMillis * this.canvasHeight;
                const availabilitySpanInSchedule = span + availabilityStartInSchedule > this.canvasHeight ? this.canvasHeight - availabilityStartInSchedule : span;
                ctx.beginPath();
                ctx.fillStyle = getPlaceholderColor.next().value;
                ctx.fillRect(30, availabilityStartInSchedule, this.canvasWidth - 40, availabilitySpanInSchedule);

                ctx.beginPath();
                ctx.fillStyle = "purple";
                ctx.fillText('55 mental EP', 30, availabilityStartInSchedule - 2);
                ctx.fillStyle = "#EED202";
                ctx.fillText('87 physical EP', this.canvasWidth * 0.6, availabilityStartInSchedule - 2);
                const investedMins = Math.round(example.temporalInvestment / (1_000 * 60));
                ctx.fillStyle = "red";
                ctx.fillText(`${investedMins} minutes`, this.canvasWidth * 0.4, availabilityStartInSchedule + availabilitySpanInSchedule);
            }
        },
    },
    mounted() {
        this.drawScheduleTimeline(this.ctx);
        this.displayAvailability(this.ctx);
        this.drawCurrentTimeMarkerInSchedule(this.ctx);
        this.scrollScheduleToTheCurrentTime();
    },
    watch: {
        availability: {
            handler: function () {
                this.displayAvailability(this.ctx);
            },
            deep: true,
        },
        dayOnView(currDayOnView: Date) {
            const today = new Date();
            const todayIsOnView = currDayOnView.getFullYear() === today.getFullYear() &&
                currDayOnView.getMonth() === today.getMonth() && currDayOnView.getDate() === today.getDate();
            // redraw all
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.drawScheduleTimeline(this.ctx);
            this.displayAvailability(this.ctx);
            if (todayIsOnView) {
                // enable current time indicator
                this.drawCurrentTimeMarkerInSchedule(this.ctx);
                this.scrollScheduleToTheCurrentTime();
            }
        },
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
</style>
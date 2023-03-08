<template>
    <v-card id="schedule-container" class="padded">
        <template v-slot:title>{{ new Date().toDateString() }}</template>
        <v-card id="schedule" ref="schedule" class="vertical-scroll padded">
            <canvas id="timeline" :width="canvasWidth" :height="canvasHeight">
            </canvas>
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
        availability: Array<AvailabilityType>,
    },
    data() {
        return {
            fifteenMinCellHeight: 60,
            canvasWidth: 200,
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
            const currentTimeMillis = (new Date().getTime() + zoneOffset) % oneDayInMillis;
            return currentTimeMillis / oneDayInMillis * this.canvasHeight;
        },
        ctx() {
            const canvas = document.getElementById("timeline") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas has no context");
            return ctx;
        }
    },
    methods: {
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
            ctx.stroke();
        },
        drawScheduleTimeline(ctx: CanvasRenderingContext2D) {
            const fifteenMinCellHeight = 60;
            const numberOfIntervalsInAday = 4 * 24;
            for (let i = 0; i < numberOfIntervalsInAday; ++i) {
                ctx.strokeStyle = "gray";
                ctx.moveTo(0, fifteenMinCellHeight * i);
                ctx.lineTo(this.canvasWidth, fifteenMinCellHeight * i);
                ctx.stroke();
                const hours = Math.floor(i / 4);
                const minutes = (i % 4) * 15;
                const timeMarkString = [hours, minutes].map(this.zeroPad).join(':');
                ctx.fillStyle = 'black';
                ctx.fillText(timeMarkString, 0, fifteenMinCellHeight * i + 10);
            }
        },
        displayAvailability(ctx: CanvasRenderingContext2D, availability: Array<AvailabilityType>) {
            if (!availability) { return; }
            const aDayInMillis = 1_000 * 60 * 60 * 24;
            const getPlaceholderColor = (function* () {
                while (true) {
                    yield '#ff00ff4f';
                    yield '#1aff004f';
                    yield '#ffe1004f';
                }
            })();
            for (const example of availability) {
                const availabilityStartInSchedule = (example.fromTime % aDayInMillis) / aDayInMillis * this.canvasHeight;
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
            }
        }
    },
    mounted() {
        const canvas = document.getElementById("timeline") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        if (ctx === null) {
            console.log("Canvas has no context");
            return;
        }
        this.drawScheduleTimeline(ctx);
        this.displayAvailability(ctx, this.availability ?? []);
        this.drawCurrentTimeMarkerInSchedule(ctx);
        this.scrollScheduleToTheCurrentTime();
    },

}
</script>

<style scope>
@import url(../assets/main.css);

#timeline {
    background-color: #79b2f479;
}

#schedule {
    height: 15rem;
}
</style>
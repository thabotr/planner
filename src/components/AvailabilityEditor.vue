<template>
    <div>

        <div class="row">
            <div id="date-picker">
                <v-date-picker v-model="range" is-range mode="dateTime" />
            </div>
            <v-card class="row padded">
                <Slider custom-color="purple" icon="mdi-brain" v-model="mES" :human-readable-effort-value="mEPoints"
                    step="10" direction="vertical" />
                <Slider custom-color="#EED202" icon="mdi-account-hard-hat" v-model="pES"
                    :human-readable-effort-value="pEPoints" step="10" direction="vertical" />
                <Slider icon="mdi-timer" direction="vertical" disabled custom-color="red"
                    :human-readable-effort-value="verboseTempInvest" model-value="50" />
            </v-card>
        </div>
        <div class="row">
            <v-btn prepend-icon="mdi-close" @click="$emit('close')">Discard</v-btn>
            <v-btn prepend-icon="mdi-progress-check" @click="() => { $emit('created', timeslot); $emit('close'); }"
                color="green">Save</v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import { toSubjectiveEffortScore, verboseTimestamp, type AvailabilityType } from '@/middleware/helpers';
import Slider from './Slider.vue';

export default {
    components: {
        Slider: Slider,
    },
    data() {
        return {
            range: {
                start: new Date(),
                end: new Date()
            },
            mES: 0,
            pES: 0,
        };
    },
    computed: {
        verboseTempInvest() {
            const diffInMs = this.range.end.getTime() - this.range.start.getTime();
            return verboseTimestamp(diffInMs);
        },
        mEPoints() { return toSubjectiveEffortScore(this.mES); },
        pEPoints() { return toSubjectiveEffortScore(this.pES); },
        timeslot(): AvailabilityType {
            const timeInvestment = this.range.end.getTime() - this.range.start.getTime();
            return {
                mES: this.mES,
                pES: this.pES,
                length: timeInvestment,
                from: this.range.start.getTime(),
            };
        }
    },
}
</script>

<style scope>
.row {
    display: flex;
    flex-direction: row;
    gap: 3rem;
}
</style>
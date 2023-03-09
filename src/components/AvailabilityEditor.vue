<template>
    <div>

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
                    :human-readable-effort-value="verboseTempInvest" model-value="50" />
            </v-card>
        </div>
        <div class="row">
            <v-btn prepend-icon="mdi-close" @click="$emit('close')">Discard</v-btn>
            <v-btn prepend-icon="mdi-progress-check" @click="() => { $emit('created', availability); $emit('close'); }"
                color="green">Save</v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import { toSubjectiveEffortScore, verboseTimestamp } from '@/middleware/helpers';
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
            mentalEffort: 0,
            physicalEffort: 0,
        };
    },
    computed: {
        verboseTempInvest() {
            const diffInMs = this.range.end.getTime() - this.range.start.getTime();
            return verboseTimestamp(diffInMs);
        },
        mentalEffortScore() { return toSubjectiveEffortScore(this.mentalEffort); },
        physicalEffortScore() { return toSubjectiveEffortScore(this.physicalEffort); },
        availability() {
            const timeInvestment = this.range.end.getTime() - this.range.start.getTime();
            return {
                mentalEffort: this.mentalEffort,
                physicalEffort: this.physicalEffort,
                temporalInvestment: timeInvestment,
                fromTime: this.range.start.getTime(),
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
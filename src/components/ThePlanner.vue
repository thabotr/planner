<template>
    <div class="row">
        <v-calendar show-weeknumbers :attributes="attributes" @dayclick="dayOnView = $event.date">
        </v-calendar>
        <DaySchedule :availability="availability" :dayOnView="dayOnView" />
    </div>
    <v-btn id="create-availability" icon="mdi-timeline-plus" @click="openDialog" />
    <v-dialog v-model="addingAvailability" transition="dialog-bottom-transition" persistent>
        <AvailabilityEditor @close="closeDialog" @created="onAvailabilityCreated" />
    </v-dialog>
</template>

<script lang="ts">
import { toSubjectiveEffortScore, verboseTimestamp } from '@/middleware/helpers';
import AvailabilityEditor from './AvailabilityEditor.vue';
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
        DaySchedule: DaySchedule,
        AvailabilityEditor: AvailabilityEditor,
    },
    data() {
        return {
            addingAvailability: false,
            dayOnView: new Date(),
            mentalEffort: 0,
            physicalEffort: 0,
            availability: [] as AvailabilityType[],
        }
    },
    computed: {
        attributes() {
            const todayAndDayOnviewMarkers = [
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
            ];
            const availabilityPerDayMarkers = this.availability.map(av => {
                const mEP = toSubjectiveEffortScore(av.mentalEffort);
                const pEP = toSubjectiveEffortScore(av.physicalEffort);
                const time = verboseTimestamp(av.temporalInvestment);
                return {
                    key: av.fromTime.toString(),
                    dates: av.fromTime,
                    popover: {
                        label: `xx/${mEP} mEP yy/${pEP} pEP tt/${time} T [scheduled/available]`,
                    },
                    bar: "red",
                }
            });
            const allAttributes = [...todayAndDayOnviewMarkers, ...availabilityPerDayMarkers];
            return allAttributes;
        }
    },
    methods: {
        openDialog() { this.addingAvailability = true; },
        closeDialog() { this.addingAvailability = false; },
        onAvailabilityCreated(createdAV: AvailabilityType) {
            this.availability.push(createdAV);
        }
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

.v-dialog {
    width: 50%;
}
</style>
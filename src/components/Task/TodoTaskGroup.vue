<template>
    <v-card class="fill-parent" id="container">
        <div v-if="scheduledTask && dateTimeStrings" class="padded-s gap-half flex-vertical fill-parent">
            <v-list-item :title="`starts @ ${dateTimeStrings.startTime}`" :subtitle="dateTimeStrings.startDate">
                <template v-if="alarmable" #append>
                    <v-btn :icon="alarm ? 'mdi-alarm-note' : 'mdi-alarm-plus'" density="comfortable" @click="alarm = !alarm"
                        :aria-label="alarm ? 'disable reminder' : 'enable reminder'"></v-btn>
                </template>
            </v-list-item>
            <ActiveTaskCard :task="scheduledTask"></ActiveTaskCard>
            <v-list-item :title="`ends @ ${dateTimeStrings.endTime}`" :subtitle="dateTimeStrings.duration" />
        </div>
        <div v-else class="padded-s">
            <h1 class="centered-content">
                No upcoming scheduled tasks
            </h1>
        </div>
    </v-card>
</template>

<script lang="ts">
import { dateFromMs, TimeInMillis, nowInMs } from '@/middleware/helpers';
import ScheduledDescriptiveItemType from '@/types/ScheduledDescriptiveItemType';
import ActiveTaskCard from './ActiveTaskCard.vue';

export default {
    props: {
        scheduledTask: ScheduledDescriptiveItemType,
        alarmable: Boolean,
    },
    emits: ['alarm'],
    data() {
        return {
            alarm: false,
            timeout: undefined as number | undefined,
        };
    },
    watch: {
        alarm(value: boolean) {
            if (!this.scheduledTask) {
                return
            }

            if (!value) {
                clearTimeout(this.timeout);
            } else {
                const timeToStart = this.scheduledTask.startsAtMillis - nowInMs();
                setTimeout(() => {
                    console.log('task has started');
                    this.$emit('alarm');
                }, timeToStart);
            }
        }
    },
    computed: {
        dateTimeStrings() {
            if (!this.scheduledTask) {
                return undefined;
            }

            const durationInMins = Math.floor(this.scheduledTask.length / TimeInMillis.Minute);
            let duration = `${durationInMins} minutes`;
            const timeToTaskStart = this.scheduledTask.startsAtMillis - nowInMs();
            if (timeToTaskStart < 0) {
                const timeEllapesInMins = Math.floor(-timeToTaskStart / TimeInMillis.Minute);
                duration = `${timeEllapesInMins} mins remaining`;
            }

            const start = this.scheduledTask.startsAtMillis;
            const startDateTime = dateFromMs(start);
            const end = this.scheduledTask.startsAtMillis + this.scheduledTask.length;
            const endDateTime = dateFromMs(end);
            return {
                startTime: startDateTime.toLocaleTimeString(
                    undefined, { hour12: false, hour: 'numeric', minute: 'numeric' },
                ),
                startDate: startDateTime.toLocaleDateString(
                    undefined, { year: 'numeric', month: 'short', day: '2-digit', weekday: 'long' },
                ),
                endTime: endDateTime.toLocaleTimeString(
                    undefined, { hour12: false, hour: 'numeric', minute: 'numeric' },
                ),
                duration: duration,
            };
        },
    },
    components: { ActiveTaskCard },
}
</script>

<style scope>
#container {
    background-color: var(--color-bg);
    border: 1px solid var(--color-accent);
}
</style>
<template>
    <v-validation ref="validation">
        <div class="row time-inputs">
            <div>
                <v-icon icon="mdi-timer" color="red" />
            </div>
            <div>
                <v-text-field v-model="minutes" v-on:update:model-value="$emit('update:model-value', milliseconds)" max="60"
                    min="0" hide-details single-line density="compact" type="number" :error="!!error" aria-label="minutes" />
                {{ minutes }} minutes
            </div>
            <div>
                <v-text-field v-model="hours" v-on:update:model-value="$emit('update:model-value', milliseconds)" max="24"
                    min="0" hide-details single-line density="compact" type="number" :error="!!error" aria-label="hours" />
                {{ hours }} hours
            </div>
            <div>
                <v-text-field v-model="days" v-on:update:model-value="$emit('update:model-value', milliseconds)" max="7"
                    min="0" hide-details single-line density="compact" type="number" :error="!!error" aria-label="days"/>
                {{ days }} days
            </div>
        </div>
    </v-validation>
</template>

<script lang="ts">
export default {
    props: {
        value: Number,
    },
    data() {
        return {
            minutes: 0,
            hours: 0,
            days: 0,
            error: "",
            rules: [] as Array<(value: number) => true | string>,
        };
    },
    computed: {
        milliseconds() {
            const minToMillis = this.minutes * 60 * 1_000;
            const hrsToMillis = this.hours * 60 * 60 * 1_000;
            const dysToMillis = this.days * 24 * 60 * 60 * 1_000;
            const millis = minToMillis + hrsToMillis + dysToMillis;
            return millis;
        }
    },
    mounted() {
        const concreteValue = this.value ?? 0;
        this.days = Math.floor(concreteValue / (24 * 60 * 60 * 1_000));
        this.hours = Math.floor((concreteValue % (24 * 60 * 60 * 1_000)) / (60 * 60 * 1_000));
        this.minutes = Math.floor((concreteValue % (60 * 60 * 1_000)) / (60 * 1_000));
    },
}
</script>

<style scoped>
@import url(../assets/main.css);

.row {
    display: flex;
    flex-direction: row;
}

.time-inputs {
    gap: 1rem;
    padding: 0.5rem;
}
</style>
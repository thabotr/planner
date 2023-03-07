<script lang="ts">
export default {
    props: {
        effortValue: Number,
        humanReadableEffortValue: [String, Number],
        customColor: String,
        step: String,
        icon: String,
    }
}
</script>

<template>
    <v-slider v-bind="effortValue" v-on:update:model-value="event => $emit('update:model-value', event)" color="green"
        v-bind:track-color="customColor" v-bind:step="step" thumb-label="always">
        <template v-slot:thumb-label>
            {{ humanReadableEffortValue }}
        </template>
        <template v-slot:prepend>
            <v-icon v-bind:icon="icon" v-bind:color="customColor" />
        </template>
    </v-slider>
</template>
<template>
    <v-btn :prepend-icon="icon">{{ name }}</v-btn>
</template>

<script lang="ts">
export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
    },
}
</script>

<style scoped>
/* .v-btn {
    background-color: var(--color-primary);
} */
</style>
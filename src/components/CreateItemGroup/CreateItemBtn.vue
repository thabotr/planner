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
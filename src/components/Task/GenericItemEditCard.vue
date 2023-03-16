<template></template>

<script lang="ts">
import GenericCard from './GenericCard.vue';
import ItemType from '@/types/ItemType';
export default {
    props: {
        value: {
            type: ItemType,
            required: true,
        },
    },
    components: { GenericCard }
}
</script>

<style scoped></style>
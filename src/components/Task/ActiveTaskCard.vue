<template>
    <GenericCard :item="task">
        <div class="centered-content padded-s">{{ task.description }}</div>
        <template #actions>
            <div class="centered-content flex-vertical" aria-label="actions">
                <v-btn aria-label="unschedule" @click="$emit('unschedule')" icon="mdi-calendar-minus" density="compact"
                    flat></v-btn>
                <v-btn aria-label="done" @click="$emit('done')" icon="mdi-check" density="compact" flat></v-btn>
            </div>
        </template>
    </GenericCard>
</template>

<script lang="ts">
import DescriptiveItemType from '@/types/DescriptiveItemType';
import GenericCard from './GenericCard.vue';

export default {
    props: {
        task: {
            type: DescriptiveItemType,
            required: true,
        },
    },
    components: { GenericCard }
}
</script>

<style scoped>
[aria-label='actions'] {
    gap: 1rem;
    padding: 0.2rem;
}

.v-btn {
    background-color: transparent;
    color: var(--color-primary);
}
</style>
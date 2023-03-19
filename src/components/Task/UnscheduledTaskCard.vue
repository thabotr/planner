<template>
    <GenericCard :item="item" :id="`unscheduled-task-card-${item.id}`">
        <div class="centered-content">{{ item.description }}</div>
        <template #actions>
            <div class="centered-content flex-vertical" aria-label="actions">
                <v-btn icon="mdi-drag" density="compact" flat draggable="true" aria-label="drag" @dragstart="onDrag"
                    @drag="onDrag" @dragend="onDrag" :id="`unscheduled-task-card-drag-${item.id}`"
                    class="cursor-drag"></v-btn>
                <v-btn icon="mdi-delete-forever" density="compact" flat aria-label="delete"
                    @click="$emit('delete')"></v-btn>
                <v-btn icon="mdi-pencil" density="compact" flat aria-label="edit" @click="$emit('edit')"></v-btn>
            </div>
        </template>
    </GenericCard>
</template>

<script lang="ts">
import GenericCard from './GenericCard.vue';
import DescriptiveItemType from '@/types/DescriptiveItemType';
export default {
    props: {
        item: { type: DescriptiveItemType, required: true, },
    },
    components: { GenericCard, },
    methods: {
        onDrag(event: DragEvent) {
            const card = document.getElementById(
                `unscheduled-task-card-${this.item.id}`) as HTMLElement;
            switch (event.type) {
                case 'dragstart':
                    if (!event.dataTransfer) {
                        throw new Error("no data transfer in drag event");
                    }
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.dropEffect = 'move';
                    const drag = document.getElementById(
                        `unscheduled-task-card-drag-${this.item.id}`) as HTMLElement;
                    event.dataTransfer.setDragImage(
                        card,
                        drag.offsetLeft + drag.scrollHeight / 2,
                        drag.offsetTop + drag.scrollWidth / 2,
                    );
                    card.style.opacity = '0.6';
                    event.dataTransfer.setData('unscheduledTask', JSON.stringify(this.item));
                    break;
                case 'dragend':
                    card.style.opacity = '1.0';
                    break;
            }
        },
    },
}
</script>

<style scoped>
[aria-label='actions'] {
    gap: 1rem;
}

.v-btn {
    background-color: transparent;
    color: var(--color-primary);
}
</style>
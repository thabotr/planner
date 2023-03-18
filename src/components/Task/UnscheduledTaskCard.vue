<template>
    <Card :item="item">
        <div class="centered-content">
            {{ item.description }}
        </div>
        <template #actions>
            <div class="centered-content flex-vertical" aria-label="actions">
                <v-btn icon="mdi-drag" density="compact" flat draggable="true" aria-label="drag" @dragstart="onDrag"
                    @drag="onDrag" @dragend="onDrag" ref="drag" class="cursor-drag"></v-btn>
                <v-btn icon="mdi-delete-forever" density="compact" flat aria-label="delete"
                    @click="$emit('delete')"></v-btn>
                <v-btn icon="mdi-pencil" density="compact" flat aria-label="edit" @click="$emit('edit')"></v-btn>
            </div>
        </template>
    </Card>
</template>

<script lang="ts">
import Card from './GenericCard.vue';
import type { CreateComponentPublicInstance } from 'vue';
import DescriptiveItemType from '@/types/DescriptiveItemType';
export default {
    props: {
        item: {
            type: DescriptiveItemType,
            required: true,
        }
    },
    data() {
        return {
            draggerCoords: {
                x: 0, y: 0,
            },
            prevLeftOffset: {
                x: 0, y: 0,
            },
        };
    },
    components: { Card },
    mounted() {
        const dragger = (this.$refs.drag as CreateComponentPublicInstance).$el as HTMLElement;
        this.draggerCoords = { x: dragger.getBoundingClientRect().x, y: dragger.getBoundingClientRect().y };
    },
    methods: {
        onDrag(event: DragEvent) {
            switch (event.type) {
                case 'dragstart':
                    event.dataTransfer?.setDragImage(document.createElement('div'), 0, 0);
                    break;
                case 'drag':
                    this._moveCard(event.clientX, event.clientY);
                    break;
                case 'dragend':
                    this._resetCardDrag();
            }
        },
        _resetCardDrag() {
            const card = this.$el as HTMLElement;
            this.prevLeftOffset = { x: 0, y: 0, };
            card.style.transform = `translate(0px, 0px)`;
        },
        _moveCard(draggerX: number, draggerY: number) {
            const manHDist = Math.abs(draggerX - this.draggerCoords.x) + Math.abs(draggerY - this.draggerCoords.y);
            if (manHDist > 50) {
                const [offsetX, offsetY] = [draggerX - this.draggerCoords.x, draggerY - this.draggerCoords.y];

                const card = this.$el as HTMLElement;
                card.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                card.style.zIndex = '1';
                this.prevLeftOffset = {
                    x: draggerX,
                    y: draggerY,
                };
            }
        }
    },
}
</script>

<style scope>
[aria-label='actions'] {
    gap: 1rem;
}

.v-btn {
    background-color: transparent;
    color: var(--color-primary);
}
</style>
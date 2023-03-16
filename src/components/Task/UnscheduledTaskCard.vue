<template>
    <Card :length="length" :p-e-s="pES" :id="id" :m-e-s="mES" ref="card">
        <div class="centered-content">
            {{ description }}
        </div>
        <template #actions>
            <div class="centered-content flex-vertical" aria-label="actions">
                <v-btn icon="mdi-drag" density="compact" flat draggable="true" aria-label="drag" @dragstart="onDrag"
                    @drag="onDrag" @dragend="onDrag" ref="drag"></v-btn>
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

export default {
    props: {
        description: { type: String, required: true, },
        id: { type: String, required: true, },
        pES: { type: Number, required: true, },
        mES: { type: Number, required: true, },
        length: { type: Number, required: true, },
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
                    // assume we have set this card's topleft coord on creation
                    // assume we have set this drag item's top left coord on creation
                    // get current drag position
                    this._moveCard(event.clientX, event.clientY);
                    break;
                // set this cards trasnform style to offset topleft post by difference between curr and and drag item's coords
                case 'dragend':
                    // reset tranfrom style
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

[aria-label="drag"] {
    cursor: grab;
}

.v-btn {
    background-color: transparent;
    color: var(--color-primary);
}
</style>
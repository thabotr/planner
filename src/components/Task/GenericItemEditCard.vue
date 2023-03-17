<template>
    <GenericCard :item="tempItem">
        <div class="flex-horizontal gapped-s">
            <v-chip density="compact">{{ itemType }}</v-chip>
            <slot name="header"></slot>
        </div>
        <slot></slot>
        <template #actions>
            <div class="flex-vertical justify-space-between all-actions">
                <v-btn aria-label="delete" @click="$emit('delete')" icon="mdi-delete-forever" density="compact"
                    flat></v-btn>
                <div class="flex-vertical safe-actions">
                    <v-btn aria-label="cancel" @click="$emit('cancel')" icon="mdi-close" density="compact" flat></v-btn>
                    <v-btn aria-label="save" @click="$emit('save', tempItem)" icon="mdi-content-save" density="compact"
                        flat></v-btn>
                </div>
            </div>
        </template>
        <template #controls>
            <div id="controls" class="flex-vertical">
                <div id="mes-control">
                    <v-btn icon="mdi-minus" aria-label="decrement mes" density="compact" flat
                        @click="updateES('mES', 'dec')"></v-btn>
                    <v-btn icon="mdi-plus" aria-label="increment mes" density="compact" flat
                        @click="updateES('mES', 'inc')"></v-btn>
                </div>
                <div id="pes-control">
                    <v-btn icon="mdi-minus" aria-label="decrement pes" density="compact" flat
                        @click="updateES('pES', 'dec')"></v-btn>
                    <v-btn icon="mdi-plus" aria-label="increment pes" density="compact" flat
                        @click="updateES('pES', 'inc')"></v-btn>
                </div>
                <div id="length-control">
                    <v-btn icon="mdi-undo" aria-label="decrement time" density="compact" flat
                        @click="updateLen('dec')"></v-btn>
                    <v-btn icon="mdi-fast-forward-5" aria-label="increment time" density="compact" flat
                        @click="updateLen('inc')"></v-btn>
                </div>
            </div>
        </template>
    </GenericCard>
</template>

<script lang="ts">
import GenericCard from './GenericCard.vue';
import ItemType from '@/types/ItemType';
import { TimeInMillis } from '@/middleware/helpers';

export default {
    props: {
        item: {
            type: ItemType,
            required: true,
        },
        itemType: {
            type: String,
            required: true,
        },
        lowerBound: ItemType,
    },
    data() {
        return {
            tempItem: new ItemType(this.item.length, this.item.mES, this.item.pES, this.item.id),
        };
    },
    watch: {
        lowerBound(lowerBound?: ItemType) {
            const length = Math.max(lowerBound?.length ?? this.item.length, this.item.length);
            const pES = Math.max(lowerBound?.pES ?? this.item.pES, this.item.pES);
            const mES = Math.max(lowerBound?.mES ?? this.item.mES, this.item.mES);
            this.tempItem = new ItemType(length, mES, pES, this.item.id);
        }
    },
    components: { GenericCard },
    methods: {
        updateLen(op: 'inc' | 'dec') {
            const fiveMinutes = 5 * TimeInMillis.Minute;
            const sixHours = 6 * TimeInMillis.Hour;
            const minTime = this.lowerBound?.length ?? 0;
            switch (op) {
                case 'inc':
                    const increased = this.tempItem.length + fiveMinutes;
                    const incBoundedByMax6hours = Math.min(increased, sixHours);
                    this.tempItem.length = incBoundedByMax6hours;
                    return;
                case 'dec':
                    const descreased = this.tempItem.length - fiveMinutes;
                    const decBounded = Math.max(descreased, fiveMinutes, minTime);
                    this.tempItem.length = decBounded;
            }
        },
        updateES(name: 'mES' | 'pES', op: 'inc' | 'dec') {
            switch (name) {
                case 'mES':
                    const minMES = Math.max(0, this.lowerBound?.mES ?? 0);
                    this.tempItem.mES = this.boundedSteppedUpdate(op, this.tempItem.mES, minMES);
                    return;
                default:
                    const minPES = Math.max(0, this.lowerBound?.pES ?? 0);
                    this.tempItem.pES = this.boundedSteppedUpdate(op, this.tempItem.pES, minPES);
                    return;
            }
        },
        boundedSteppedUpdate(type: 'inc' | 'dec', value: number, effortScoreMin: number): number {
            const effortScoreMax = 100;
            const effortScoreStep = 10;
            switch (type) {
                case 'inc':
                    return Math.min(value + effortScoreStep, effortScoreMax);
                default:
                    return Math.max(value - effortScoreStep, effortScoreMin);
            }
        }
    }
}
</script>

<style scoped>
.v-btn {
    background-color: transparent;
    color: var(--color-primary);
}

.all-actions {
    gap: 1rem;
    padding: 0.2rem;
}

.safe-actions {
    gap: 0.2rem;
}

#controls {
    gap: 1rem;
}
</style>
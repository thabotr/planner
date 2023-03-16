<template>
    <div>
        <v-card id="bg">
            <v-card id="fg">
                <slot></slot>
                <div class="flex-horizontal">
                    <EffortPreview :item="item" />
                    <slot name="controls"></slot>
                </div>
            </v-card>
            <div id="actions">
                <v-chip density="compact">
                    {{ item.id }}
                </v-chip>
                <slot name="actions"></slot>
            </div>
        </v-card>
    </div>
</template>

<script lang="ts">
import EffortPreview from './EffortPreview.vue';
import ItemType from '@/types/ItemType';
export default {
    props: {
        item: {
            type: ItemType,
            required: true,
        }
    },
    components: { EffortPreview }
}
</script>

<style scoped>
#bg {
    display: flex;
    padding-right: 0.5rem;
    background-color: var(--color-accent);
}

#fg {
    margin-right: 0.5rem;
    background-color: var(--color-secondary);
    padding: 1rem;
    flex: 1;
}

#actions {
    height: 100%;
    width: 5rem;
    padding-block: 0.5rem;
}

#actions .v-chip {
    background-color: var(--color-secondary);
}

.v-card {
    border-radius: 1rem;
}
</style>
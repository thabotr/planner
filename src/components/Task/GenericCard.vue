<template>
    <div>
        <v-card id="bg">
            <div>
                <v-card id="fg">
                    <slot></slot>
                    <div class="flex-horizontal">
                        <EffortPreview :item="item" />
                        <slot name="controls"></slot>
                    </div>
                </v-card>
            </div>
            <div id="actions" class="padded-s">
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
    display: grid;
    grid-template-columns: 1fr auto;
    background-color: var(--color-accent);
}

#fg {
    background-color: var(--color-secondary);
    padding: 1rem;
    flex: 1;
}

#actions {
    padding-block: 1rem;
    display: grid;
}

#actions .v-chip {
    background-color: var(--color-secondary);
}

.v-card {
    border-radius: 1rem;
}
</style>
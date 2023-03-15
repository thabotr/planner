<template>
    <div>
        <v-card id="bg">
            <v-card id="fg">
                <slot></slot>
                <div class="flex-horizontal">
                    <EffortPreview :m-e-s="mES" :length="length" :p-e-s="pES" />
                    <slot name="controls"></slot>
                </div>
            </v-card>
            <div id="actions">
                <v-chip density="compact">
                    {{ id }}
                </v-chip>
                <slot name="actions"></slot>
            </div>
        </v-card>
    </div>
</template>

<script lang="ts">
import EffortPreview from './EffortPreview.vue';

export default {
    props: {
        id: { type: String, required: true },
        mES: { type: Number, required: true },
        pES: { type: Number, required: true },
        length: { type: Number, required: true },
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
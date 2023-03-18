<template>
    <div>
        <v-card>
            <div class="flex-horizontal">
                <EffortPreviewVue :item="timeslot">
                    <template #before-mep>{{ consumedMEP }}/</template>
                    <template #before-pep>{{ consumedPEP }}/</template>
                    <template #before-time>{{ consumedTime }}/</template>
                </EffortPreviewVue>
                <div id="actions" class="flex-vertical justify-space-between">
                    <v-chip density="compact">
                        {{ timeslot.id }}
                    </v-chip>
                    <v-btn icon="mdi-pencil" density="compact" flat aria-label="edit" @click="$emit('edit')"></v-btn>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script lang="ts">
import { toSubjectiveEffortScore, verboseTimestamp } from '@/middleware/helpers';
import ItemType from '@/types/ItemType';
import EffortPreviewVue from './Task/EffortPreview.vue';
export default {
    props: {
        timeslot: {
            type: ItemType,
            required: true,
        },
        usage: {
            type: ItemType,
            required: true,
        },
    },
    computed: {
        consumedMEP() { return toSubjectiveEffortScore(this.usage.mES); },
        consumedPEP() { return toSubjectiveEffortScore(this.usage.pES); },
        consumedTime() { return verboseTimestamp(this.usage.length); },
    }
    ,
    components: { EffortPreviewVue, }
}

</script>

<style scoped>
.v-btn {
    background-color: transparent;
}

#actions .v-chip {
    background-color: var(--color-secondary);
}

#actions {
    padding: 0.2rem;
}

.v-btn {
    background-color: transparent;
    color: var(--color-primary);
}

.v-card {
    background-image: linear-gradient(var(--color-accent), var(--color-highlight));
}
</style>
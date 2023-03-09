<template>
    <v-card>
        <div class="justify-space-between">
            <v-icon draggable="true" icon="mdi-drag" @dragstart="startDrag"></v-icon>
            <v-chip color="primary" size="x-small">{{ id }}</v-chip>
        </div>
        <v-card-text>{{ description }}</v-card-text>
        <div class="effort-field">
            <v-btn><v-icon start icon="mdi-brain" color="purple"></v-icon>{{ mentalEffortScore }}</v-btn>
            <v-btn><v-icon start icon="mdi-account-hard-hat" color="#EED202"></v-icon>{{ physicalEffortScore }}</v-btn>
            <v-btn><v-icon start icon="mdi-timer" color="red"></v-icon>{{ temporalInvestmentStamp }}</v-btn>
        </div>
        <v-card-actions class="justify-space-between">
            <v-btn append-icon="mdi-delete" @click="$emit('onDelete', id)">
                Delete
            </v-btn>
            <v-btn append-icon="mdi-pencil" @click="$emit('onEdit', id)">
                Edit
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script lang="ts">
import { toSubjectiveEffortScore, verboseTimestamp } from '../middleware/helpers';
export default {
    props: {
        description: String,
        mentalEffort: Number,
        physicalEffort: Number,
        temporalInvestment: Number,
        id: String,
    },
    computed: {
        mentalEffortScore() {
            return toSubjectiveEffortScore(this.mentalEffort);
        },
        physicalEffortScore() {
            return toSubjectiveEffortScore(this.physicalEffort);
        },
        temporalInvestmentStamp() { return verboseTimestamp(this.temporalInvestment ?? 0); },
    },
    methods: {
        startDrag(event: DragEvent) {
            if (!event.dataTransfer) {
                throw new Error("no data transfer in drag event");
            }
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('id', this.id ?? '');
        }
    }
}
</script>
<style scoped>
@import url(../assets/main.css);
.v-card {
    padding: 1rem;
}

.effort-field {
    display: flex;
    gap: 0.5rem;
}

[draggable="true"] {
    cursor: pointer;
}
</style>
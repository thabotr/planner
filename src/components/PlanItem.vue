<template>
    <v-card>
        <div class="justify-space-between">
            <v-icon draggable="true" icon="mdi-drag" @dragstart="startDrag"></v-icon>
            <v-chip color="primary" size="x-small">{{ id }}</v-chip>
        </div>
        <v-card-text>{{ description }}</v-card-text>
        <div class="effort-field centered-content">
            <v-chip color="purple" label>
                <v-icon start icon="mdi-brain"></v-icon>
                {{ mentalEffortScore }}
            </v-chip>
            <v-chip color="#EED202" label>
                <v-icon start icon="mdi-account-hard-hat"></v-icon>
                {{ physicalEffortScore }}
            </v-chip>
            <v-chip color="red" label>
                <v-icon start icon="mdi-timer" color="red"></v-icon>
                {{ temporalInvestmentStamp }}
            </v-chip>
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
import { toSubjectiveEffortScore, verboseTimestamp, type TaskType} from '../middleware/helpers';
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
            const task: TaskType = {
                length: this.temporalInvestment ?? -1,
                mES: this.mentalEffort ?? -1,
                pES: this.physicalEffort ?? -1,
                id: this.id ?? "-1",
                description: this.description ?? "",
            };
            const taskAsString = JSON.stringify(task);
            event.dataTransfer.setData('task', taskAsString);
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
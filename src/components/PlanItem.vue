<template>
    <v-card>
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
import { toSubjectiveEffortScore, toTimeStamp } from '../middleware/helpers';
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
        temporalInvestmentStamp() { return toTimeStamp(this.temporalInvestment ?? 0); }
    }
}
</script>
<style scoped>
.v-card {
    padding: 1rem;
}

.effort-field {
    display: flex;
    gap: 0.5rem;
}
</style>
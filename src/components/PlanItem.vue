<script lang="ts">
export default {
    props: {
        description: String,
        mentalEffort: Number,
        physicalEffort: Number,
        temporalInvestment: Number,
        id: String,
    },
}
</script>
<template>
    <v-card>
        <v-card-text>{{ description }}</v-card-text>
        <div class="effort-field">
            <v-btn><v-icon start icon="mdi-brain"></v-icon>{{ mentalEffort }}</v-btn>
            <v-btn><v-icon start icon="mdi-account-hard-hat"></v-icon>{{ physicalEffort }}</v-btn>
            <v-btn><v-icon start icon="mdi-timer"></v-icon>{{ temporalInvestment }}</v-btn>
        </div>
        <v-card-actions class="justify-space-between">
            <v-btn variant="text" append-icon="mdi-delete" @click="$emit('onDelete', id)">
                Delete
            </v-btn>
            <v-btn variant="text" append-icon="mdi-pencil" @click="$emit('onEdit', id)">
                Edit
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
.v-card {
    padding: 1rem;
}

.effort-field {
    display: flex;
    gap: 0.5rem;
}
</style>
<template>
    <v-card>
        <v-icon draggable="true" icon="mdi-drag" @dragstart="startDrag"></v-icon>
        <v-chip color="primary" size="x-small">{{ task.id }}</v-chip>
    </v-card>
</template>

<script lang="ts">
export default {
    props: ['task'],
    methods: {
        startDrag(event: DragEvent) {
            if (!event.dataTransfer) {
                throw new Error("no data transfer in drag event");
            }
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            const taskAsString = JSON.stringify(this.task);
            event.dataTransfer.setData('task', taskAsString);
        }
    }
}

</script>

<style scope>
.v-card {
    padding: 2px;
}

[draggable] {
    cursor: pointer;
}
</style>
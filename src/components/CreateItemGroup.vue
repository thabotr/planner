<template>
    <div id="container">
        <CreateItemBtn name="Timeslot" icon="mdi-calendar" aria-label="create timeslot" v-if="expanded" @click="$emit('create-timeslot')" />
        <CreateItemBtn name="Task" icon="mdi-clipboard-edit" aria-label="create task" v-if="expanded" @click="$emit('create-task')"/>
        <v-btn icon :aria-label="controllerLabel" @click="expanded = !expanded">
            <v-icon :icon="controllerIcon"></v-icon>
        </v-btn>
    </div>
</template>

<script lang="ts">
import CreateItemBtn from '@/components/CreateItemGroup/CreateItemBtn.vue';
export default {
    components: {
        CreateItemBtn
    },
    data() {
        return {
            expanded: false,
        };
    },
    computed: {
        controllerLabel() {
            return this.expanded ? 'close create item menu' : 'open create item menu';
        },
        controllerIcon() {
            return this.expanded ? 'mdi-minus' : 'mdi-plus';
        }
    }
}
</script>

<style>
.v-btn {
    background-color: var(--color-primary);
    color: var(--color-accent);
}

#container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
}
</style>
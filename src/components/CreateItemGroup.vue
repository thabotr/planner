<template>
    <div id="create-item-group-container" class="flex-vertical">
        <CreateItemBtn name="Timeslot" icon="mdi-calendar" aria-label="create timeslot" v-if="expanded"
            @click="() => createItem('timeslot')" />
        <CreateItemBtn name="Task" icon="mdi-clipboard-edit" aria-label="create task" v-if="expanded"
            @click="() => createItem('task')" />
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
    },
    emits: ['create-timeslot', 'create-task'],
    methods: {
        createItem(type: 'timeslot' | 'task') {
            this.expanded = false;
            this.$emit(`create-${type}`);
        }
    }
}
</script>

<style scoped>
.v-btn {
    background-color: var(--color-primary);
    color: var(--color-accent);
}

#create-item-group-container {
    align-items: flex-end;
    gap: 1rem;
}
</style>
<template>
    <div id="plan-items-container">
        <PlanItem v-for="task in tasks.values()" v-bind="task" @on-delete="onDeletePlanItem" @on-edit="onEditPlanItem" />
    </div>
    <v-col cols="auto">
        <v-dialog transition="dialog-bottom-transition" width="50%" v-model="editingPlanItem">
            <template v-slot:activator="parent">
                <v-btn id="create-plan-item" @click="onCreatePlanItem" icon="mdi-pen-plus" color="green">
                </v-btn>
            </template>
            <template v-slot:default>
                <v-card>
                    <v-toolbar color="green" title="New Plan Item"></v-toolbar>
                    <v-text-field label="Task Description"
                        :rules="[value => (value || '').length >= 5 || 'Minimum 5 characters text']" required
                        v-model="tempTask.description" type="input"></v-text-field>
                    <v-card-actions class="justify-end">
                        <v-btn variant="text" @click="onDiscardPlanItemEdit" prepend-icon="mdi-close">Discard</v-btn>
                        <v-btn @click="onSavePlanItemEdit" variant="text" prepend-icon="mdi-content-save">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </v-col>
</template>

<script lang="ts">
import PlanItem from './PlanItem.vue';
type TaskType = {
    id: string,
    description: string,
    mentalEffort: number,
    physicalEffort: number,
    temporalInvestment: number
};
const GetDefaultTask = (): TaskType => ({
    id: '',
    description: '',
    mentalEffort: -1,
    physicalEffort: -1,
    temporalInvestment: -1,
});

export default {
    components: {
        PlanItem: PlanItem
    },
    data() {
        return {
            tasks: new Map<string,TaskType>(),
            editingPlanItem: false,
            tempTask: GetDefaultTask(),
        }
    },
    methods: {
        onSavePlanItemEdit() {
            const oldTaskId = this.tempTask.id;
            const isPlanItemUpdate = this.tasks.has(oldTaskId);
            if(isPlanItemUpdate)
            {
                this.tasks.set(this.tempTask.id, this.tempTask);
            } else {
                const newTaskId = new Date().getTime().toString();
                const task = {
                    ...this.tempTask,
                    id: newTaskId,
                }
                this.tasks.set(newTaskId, task);
            }
            this.restoreTempTaskToDefault();
            this.closeDialog();
        },
        onCreatePlanItem() {
            this.openDialog();
        },
        onDeletePlanItem(itemId: string) {this.tasks.delete(itemId);},
        onEditPlanItem(itemId: string) {
            this.openDialog();
            const taskToOpen = this.tasks.get(itemId);
            if(!taskToOpen) {
                alert("Oops! task not found");
                return;
            }
            this.tempTask = {...taskToOpen};
        },
        onDiscardPlanItemEdit() {
            this.restoreTempTaskToDefault();
            this.closeDialog();
        },
        closeDialog () {this.editingPlanItem = false;},
        openDialog () {this.editingPlanItem = true;},
        restoreTempTaskToDefault(){this.tempTask = GetDefaultTask();},
    }
}
</script>

<style scoped>
#create-plan-item {
    position: fixed;
    right: 3rem;
    bottom: 3rem;
}

#plan-items-container {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}
</style>
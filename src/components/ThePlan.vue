<template>
    <div id="plan-items-container">
        <PlanItem v-for="task in tasks.values()" v-bind="task" @on-delete="onDeletePlanItem" @on-edit="onEditPlanItem" />
    </div>
    <v-col cols="auto">
        <v-dialog v-model="editingPlanItem" transition="dialog-bottom-transition" persistent>
            <template v-slot:activator>
                <v-btn id="create-plan-item" @click="onCreatePlanItem" icon="mdi-pen-plus">
                </v-btn>
            </template>
            <template v-slot:default>
                <v-card>
                    <v-toolbar title="New Plan Item" />
                    <v-text-field label="Task Description" :rules="[ruleMinimumFiveChars]" required
                        v-model="tempTask.description" type="input" />
                    <v-slider v-model="tempTask.mentalEffort" id="mental-effort-slider" prepend-icon="mdi-brain"/>
                    <v-slider v-model="tempTask.physicalEffort" id="physical-effort-slider" prepend-icon="mdi-account-hard-hat"/>
                    <v-slider v-model="tempTask.temporalInvestment" id="temporal-investment-slider" prepend-icon="mdi-timer"/>
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
export default {
    components: {
        PlanItem: PlanItem
    },
    data() {
        return {
            tasks: new Map<string, TaskType>(),
            editingPlanItem: false,
            tempTask: CreateDefaultTask(),
        }
    },
    methods: {
        onSavePlanItemEdit() {
            const taskId = this.tempTask.id;
            const updatingOldTask = this.tasks.has(taskId);
            if (updatingOldTask) {
                this.tasks.set(taskId, this.tempTask);
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
        onDeletePlanItem(itemId: string) { this.tasks.delete(itemId); },
        onEditPlanItem(itemId: string) {
            const taskToOpen = this.tasks.get(itemId);
            if (!taskToOpen) {
                alert("Oops! task not found");
                return;
            }
            this.tempTask = { ...taskToOpen };
            this.openDialog();
        },
        onDiscardPlanItemEdit() {
            this.restoreTempTaskToDefault();
            this.closeDialog();
        },
        closeDialog() { this.editingPlanItem = false; },
        openDialog() { this.editingPlanItem = true; },
        restoreTempTaskToDefault() { this.tempTask = CreateDefaultTask(); },
        ruleMinimumFiveChars: (value: string) => (value || '').length >= 5 || 'Minimum 5 characters text',
    }
};
type TaskType = {
    id: string,
    description: string,
    mentalEffort: number,
    physicalEffort: number,
    temporalInvestment: number
};
const CreateDefaultTask = (): TaskType => ({
    id: '',
    description: '',
    mentalEffort: 0,
    physicalEffort: 0,
    temporalInvestment: 0,
});
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

.v-dialog {
    width: 40%;
}

#create-plan-item,
.v-toolbar {
    background-color: rgba(0, 128, 0, 0.812);
}
</style>
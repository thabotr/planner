<template>
    <div id="plan-items-container">
        <PlanItem v-for="task in unscheduledTasks" v-bind="task" @on-delete="onDeletePlanItem" @on-edit="onEditPlanItem" />
    </div>
    <v-col cols="auto">
        <v-dialog v-model="editingPlanItem" transition="dialog-bottom-transition" persistent>
            <template v-slot:activator>
                <v-btn id="create-plan-item" @click="onCreatePlanItem" icon="mdi-pen-plus" color="green">
                </v-btn>
            </template>
            <TaskEditor v-model="tempTask" />
        </v-dialog>
    </v-col>
</template>

<script lang="ts">
import { toSubjectiveEffortScore } from '@/middleware/helpers';
import type { TaskType } from '@/middleware/helpers';
import PlanItem from './PlanItem.vue';
import Slider from './Slider.vue';
import TimeInvestmentInput from './TimeInvestmentInput.vue';
import { useScheduleItemsStore } from '../stores/scheduleItems';
import { mapActions, mapState } from 'pinia';
import TaskEditor from './TaskEditor.vue';

export default {
    components: {
        PlanItem: PlanItem,
        Slider: Slider,
        TimeInvestmentInput: TimeInvestmentInput,
        TaskEditor: TaskEditor,
    },
    data() {
        return {
            editingPlanItem: false,
            tempTask: CreateDefaultTask(),
        }
    },
    computed: {
        tempMentalEffort() {
            return toSubjectiveEffortScore(this.tempTask.mES);
        },
        tempPhysicalEffort() {
            return toSubjectiveEffortScore(this.tempTask.pES);
        },
        ...mapState(useScheduleItemsStore, ['unscheduledTasks', 'tasks']),
    },
    methods: {
        onSavePlanItemEdit() {
            const taskId = this.tempTask.id;
            const updatingOldTask = this.tasks.has(taskId);
            // if (updatingOldTask) {
            //     // this.tasks.set(taskId, this.tempTask);
            // } else {
            //     const newTaskId = Scheduler.getId().toString();
            //     const task = {
            //         ...this.tempTask,
            //         id: newTaskId,
            //     }
            //     this.tasks.set(newTaskId, task);
            this.addTask({
                description: this.tempTask.description,
                length: this.tempTask.length,
                mES: this.tempTask.mES,
                pES: this.tempTask.pES,
            });
            // }
            this.restoreTempTaskToDefault();
            this.closeDialog();
        },
        onCreatePlanItem() { this.openDialog(); },
        onDeletePlanItem(itemId: string) { this.tasks.delete(itemId); },
        onEditPlanItem(itemId: string) {
            const taskToOpen = this.tasks.get(itemId);
            if (!taskToOpen) {
                alert("Oops! task not found");
                return;
            }
            // this.tempTask = { ...taskToOpen };
            this.openDialog();
        },
        onDiscardPlanItemEdit() {
            this.restoreTempTaskToDefault();
            this.closeDialog();
        },
        closeDialog() { this.editingPlanItem = false; },
        openDialog() { this.editingPlanItem = true; },
        restoreTempTaskToDefault() { this.tempTask = CreateDefaultTask(); },
        ...mapActions(useScheduleItemsStore, ['addTask']),
    }
};

const CreateDefaultTask = (): TaskType => ({
    id: '',
    description: '',
    mES: 0,
    pES: 0,
    length: 0,
});
</script>

<style scoped>
#create-plan-item {
    position: fixed;
    left: 40%;
    bottom: 5%;
}

#plan-items-container {
    gap: 1rem;
    flex-wrap: wrap;
    display: flex;
}

.v-dialog {
    width: 40%;
}

#create-plan-item,
.v-toolbar {
    background-color: rgba(0, 128, 0, 0.812);
}

.v-text-field {
    margin: 1rem;
}

.padded {
    padding: 1rem;
}
</style>
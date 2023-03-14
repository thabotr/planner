<template>
    <div id="plan-items-container">
        <PlanItem class="plan-item" v-for="task in unscheduledTasks" v-bind="task" @on-delete="onDeletePlanItem"
            @on-edit="onEditPlanItem" />
        <GetGithubIssuesBtn></GetGithubIssuesBtn>
    </div>
    <v-col cols="auto">
        <v-dialog v-model="editingPlanItem" transition="dialog-bottom-transition" persistent>
            <template v-slot:activator>
                <v-btn id="create-plan-item" @click="onCreatePlanItem" icon="mdi-pen-plus" color="green">
                </v-btn>
            </template>
            <TaskEditor v-model="tempTask" @discard="onDiscardPlanItemEdit" @update:model-value="onSavePlanItem" />
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
import GetGithubIssuesBtn from './GetGithubIssuesBtn.vue';

export default {
    components: {
        PlanItem: PlanItem,
        Slider: Slider,
        TimeInvestmentInput: TimeInvestmentInput,
        TaskEditor: TaskEditor,
        GetGithubIssuesBtn
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
        onSavePlanItem(task: TaskType) {
            const creating = task.id === '';
            if (creating) {
                this.addTask(task);
            } else {
                this.updateTask(task);
            }
            this.restoreTempTaskToDefault();
            this.closeDialog();
        },
        onCreatePlanItem() { this.openDialog(); },
        onDeletePlanItem(taskId: string) { this.removeTask(taskId); },
        onEditPlanItem(taskId: string) {
            const taskToOpen = this.getTask(taskId);
            if (!taskToOpen) {
                this.$emit("error", {
                    type: "Failed to open task",
                    message: `Task ${taskId} not found`,
                })
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
        ...mapActions(useScheduleItemsStore, ['addTask', 'getTask', 'removeTask', 'updateTask']),
    },
    mounted() {

    },
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
    display: flex;
    overflow-x: scroll;
    flex-wrap: wrap;
    height: 100vh;
    padding: 1rem;
}

.plan-item {
    max-width: 45%;
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
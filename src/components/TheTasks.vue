<template>
    <div id="plan-items-container">
        <PlanItem v-for="task in tasks.values()" v-bind="task" @on-delete="onDeletePlanItem" @on-edit="onEditPlanItem" />
    </div>
    <v-col cols="auto">
        <v-dialog v-model="editingPlanItem" transition="dialog-bottom-transition" persistent>
            <template v-slot:activator>
                <v-btn id="create-plan-item" @click="onCreatePlanItem" icon="mdi-pen-plus" color="green">
                </v-btn>
            </template>
            <template v-slot:default>
                <v-card>
                    <v-toolbar title="Plan Item" />
                    <v-text-field label="What task do you want to accomplish?" :rules="[ruleMinimumFiveChars]" required
                        v-model="tempTask.description" type="input" aria-multiline="true" />
                    <div class="padded">
                        <Slider v-model="tempTask.mentalEffort" custom-color="purple" step="10" icon="mdi-brain"
                            v-bind:human-readable-effort-value="tempMentalEffort" />
                        <Slider v-model="tempTask.physicalEffort" custom-color="#EED202" step="10"
                            icon="mdi-account-hard-hat" v-bind:human-readable-effort-value="tempPhysicalEffort" />
                        <TimeInvestmentInput :value=tempTask.temporalInvestment v-model="tempTask.temporalInvestment" />
                    </div>
                    <v-card-actions class="justify-end">
                        <v-btn variant="text" @click="onDiscardPlanItemEdit" prepend-icon="mdi-close">Discard</v-btn>
                        <v-btn @click="onSavePlanItemEdit" variant="text" prepend-icon="mdi-content-save"
                            color="green">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </v-col>
</template>

<script lang="ts">
import { toSubjectiveEffortScore, toTimeStamp } from '@/middleware/helpers';
import PlanItem from './PlanItem.vue';
import Slider from './Slider.vue';
import TimeInvestmentInput from './TimeInvestmentInput.vue';
export default {
    components: {
        PlanItem: PlanItem,
        Slider: Slider,
        TimeInvestmentInput: TimeInvestmentInput,
    },
    data() {
        return {
            tasks: new Map<string, TaskType>(),
            editingPlanItem: false,
            tempTask: CreateDefaultTask(),
        }
    },
    computed: {
        tempMentalEffort() {
            return toSubjectiveEffortScore(this.tempTask.mentalEffort);
        },
        tempPhysicalEffort() {
            return toSubjectiveEffortScore(this.tempTask.physicalEffort);
        },
    },
    created() {
        // insert fake data
        this.tasks.set(
            "13",
            {
                id: "13",
                description: "Familiarize self with VueJS- Perform Framework Overview",
                mentalEffort: 85,
                physicalEffort: 45,
                temporalInvestment: this.randomTime(),
            });
        this.tasks.set(
            "17",
            {
                id: "17",
                description: "Learn VueJS - do a programming project",
                mentalEffort: 68,
                physicalEffort: 92,
                temporalInvestment: this.randomTime(),
            });
        this.tasks.set(
            "19",
            {
                id: "19",
                description: "C# advanced review",
                mentalEffort: 98,
                physicalEffort: 60,
                temporalInvestment: this.randomTime(),
            });
        this.tasks.set(
            "28",
            {
                id: "28",
                description: "Design patterns overview",
                mentalEffort: 50,
                physicalEffort: 2,
                temporalInvestment: this.randomTime(),
            });
        this.tasks.set(
            "33",
            {
                id: "33",
                description: "Learn Design patterns - programming exercises",
                mentalEffort: 67,
                physicalEffort: 93,
                temporalInvestment: this.randomTime(),
            });
        this.tasks.set(
            "38",
            {
                id: "38",
                description: "Learn VueJS - advanced review",
                mentalEffort: 73,
                physicalEffort: 72,
                temporalInvestment: this.randomTime(),
            });
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
        onCreatePlanItem() { this.openDialog(); },
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
        randomTime: () => Math.round(Math.random() * 1_000 * 60 * 60 * 24),
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
    position: absolute;
    right: 1rem;
    bottom: 1rem;
}

#plan-items-container {
    gap: 1rem;
    flex-wrap: wrap;
    display: grid;
    grid-template-columns: 1fr 1fr;
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
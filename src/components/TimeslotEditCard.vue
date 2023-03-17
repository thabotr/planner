<template>
    <GenericItemEditCard :item="tempTimeSlot" item-type="TSLOT" :lower-bound="sumOfAllTaskEfforts" @save="onSave">
        <div>
            <v-list v-if="tasks.length">
                <v-list-item v-for="item in tempMetaDataForTasks" :selected="item.selected">
                    <div>
                        {{ item.task.description }}
                    </div>
                    <template v-slot:prepend>
                        <v-checkbox-btn v-model="item.selected" density="compact"></v-checkbox-btn>
                    </template>
                    <template v-slot:append>
                        <v-chip density="compact">{{ item.id }}</v-chip>
                        <v-btn icon="mdi-equal" variant="flat" density="compact" class="cursor-drag"></v-btn>
                    </template>
                </v-list-item>
            </v-list>
            <v-chip-group v-if="tasks.length">
                <v-chip prepend-icon="mdi-brain" density="compact">
                    {{ remainingEffort.mEP }} mEP
                </v-chip>
                <v-chip prepend-icon="mdi-account-hard-hat" density="compact">
                    {{ remainingEffort.pEP }} pEP
                </v-chip>
                <v-chip prepend-icon="mdi-timer" density="compact">
                    {{ remainingEffort.time }}
                </v-chip>
            </v-chip-group>
        </div>
        <template #header>
            <Datepicker v-model="startTimeDate" teleport="body">
                <template #trigger>
                    <v-chip prepend-icon="mdi-calendar-clock" density="compact" class="cursor-pointer" link>
                        {{ startTimeString }}
                    </v-chip>
                </template>
            </Datepicker>
        </template>
    </GenericItemEditCard>
</template>


<script lang="ts">
import type DescriptiveItemType from '@/types/DescriptiveItemType';
import TimedItemType from '@/types/TimedItemType';
import GenericItemEditCard from './Task/GenericItemEditCard.vue';

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import ItemType from '@/types/ItemType';
import { toSubjectiveEffortScore, TimeInMillis, type TaskType, dateToMs, dateFromMs } from '@/middleware/helpers';

export default {
    props: {
        timeslot: {
            type: TimedItemType,
            required: true,
        },
        tasks: {
            type: Array<DescriptiveItemType>,
            required: true,
        },
    },
    data() {
        return {
            startTimeDate: dateFromMs(this.timeslot.startTime),
            tempTimeSlot: new TimedItemType(
                this.timeslot.id,
                this.timeslot.length,
                this.timeslot.pES,
                this.timeslot.mES,
                this.timeslot.startTime
            ),
            tempMetaDataForTasks: this.tasks.map(task => ({
                task: task,
                id: task.id,
                selected: true,
            })),
        };
    },
    components: { GenericItemEditCard, Datepicker },
    computed: {
        startTimeString() {
            return this.startTimeDate.toLocaleString(
                undefined,
                { hour12: false, day: '2-digit', month: "short", year: 'numeric', hour: '2-digit', minute: 'numeric' },
            );
        },
        remainingEffort(): { time: string, pEP: number, mEP: number } {
            const effortDiff = new ItemType(
                this.tempTimeSlot.length - this.sumOfAllTaskEfforts.length,
                this.tempTimeSlot.mES - this.sumOfAllTaskEfforts.mES,
                this.tempTimeSlot.pES - this.sumOfAllTaskEfforts.pES,
                '',
            );
            return {
                time: `${Math.floor(effortDiff.length/TimeInMillis.Minute)}mins`,
                pEP: toSubjectiveEffortScore(effortDiff.pES),
                mEP: toSubjectiveEffortScore(effortDiff.mES),
            };
        },
        sumOfAllTaskEfforts(): ItemType {
            const items = this.tempMetaDataForTasks
                .filter(item => item.selected)
                .map(item => item.task as ItemType);
            if (!items.length) {
                return new ItemType(0, 0, 0, '');
            }
            return items.reduce((a, b) => new ItemType(a.length + b.length, a.mES + b.mES, a.pES + b.pES, ''));
        }
    },
    methods: {
        onSave(item: TaskType) {
            const selectedTasks = this.tempMetaDataForTasks
                .filter(item => item.selected)
                .map(item => item.task);
            const updatedTimeslot = new TimedItemType(
                this.tempTimeSlot.id,
                item.length,
                item.pES,
                item.mES,
                dateToMs(this.startTimeDate),
            );
            this.$emit('save', updatedTimeslot, selectedTasks);
        },
    },
    emits: ['save'],
}
</script>

<style scoped>
.v-btn {
    background-color: transparent;
    color: var(--color-primary);
}

.v-list {
    background-color: transparent;
}

.v-list-item[selected='false'] *:not(.v-checkbox-btn) {
    opacity: 0.5;
}
</style>
<template>
    <GenericItemEditCard :item="tempTimeSlot" item-type="TSLOT" :lower-bound="sumOfAllTaskEfforts" @save="onSave">
        <div>
            <v-list v-if="timeslot.scheduledTasks.length">
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
            <v-chip-group v-if="timeslot.scheduledTasks.length">
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
import TimedItemType from '@/types/TimedItemType';
import GenericItemEditCard from './Task/GenericItemEditCard.vue';

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import ItemType from '@/types/ItemType';
import { toSubjectiveEffortScore, TimeInMillis, type TaskType, dateToMs, dateFromMs } from '@/middleware/helpers';
import TimedItemTypeWithTasks from '@/types/TimedItemTypeWithTasks';

export default {
    props: {
        timeslot: {
            type: TimedItemTypeWithTasks,
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
            tempMetaDataForTasks: this.timeslot.scheduledTasks.map(task => ({
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
                time: `${Math.floor(effortDiff.length / TimeInMillis.Minute)}mins`,
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
            const updatedTimeslot = new TimedItemTypeWithTasks(
                this.tempTimeSlot.id,
                item.length,
                item.pES,
                item.mES,
                dateToMs(this.startTimeDate),
                selectedTasks,
            );
            this.$emit('save', updatedTimeslot);
        },
    },
    emits: ['save'],
}
</script>

<style>
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

.dp__theme_light {
   --dp-background-color: var(--color-bg);
   --dp-text-color: var(--color-accent);
   --dp-hover-color: #f3f3f3;
   --dp-hover-text-color: #212121;
   --dp-hover-icon-color: #959595;
   --dp-primary-color: #1976d2;
   --dp-primary-text-color: #f8f5f5;
   --dp-secondary-color: #c0c4cc84;
   --dp-border-color: #ddd;
   --dp-menu-border-color: #ddd;
   --dp-border-color-hover: #aaaeb7;
   --dp-disabled-color: #f6f6f6;
   --dp-scroll-bar-background: #f3f3f3;
   --dp-scroll-bar-color: #959595;
   --dp-success-color: var(--color-highlight);
   --dp-success-color-disabled: #a3d9b1;
   --dp-icon-color: #959595;
   --dp-danger-color: #ff6f60;
   --dp-highlight-color: rgba(25, 118, 210, 0.1);
}


.dp__theme_dark {
   --dp-background-color: #212121;
   --dp-text-color: #ffffff;
   --dp-hover-color: #484848;
   --dp-hover-text-color: #ffffff;
   --dp-hover-icon-color: #959595;
   --dp-primary-color: #005cb2;
   --dp-primary-text-color: #ffffff;
   --dp-secondary-color: #a9a9a9;
   --dp-border-color: #2d2d2d;
   --dp-menu-border-color: #2d2d2d;
   --dp-border-color-hover: #aaaeb7;
   --dp-disabled-color: #737373;
   --dp-scroll-bar-background: #212121;
   --dp-scroll-bar-color: #484848;
   --dp-success-color: #00701a;
   --dp-success-color-disabled: #428f59;
   --dp-icon-color: #959595;
   --dp-danger-color: #e53935;
   --dp-highlight-color: rgba(0, 92, 178, 0.2);
}
</style>
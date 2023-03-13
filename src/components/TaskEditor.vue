<template>
    <v-card>
        <v-toolbar title="Plan Item" />
        <v-card-text>
            {{ task.description }}
        </v-card-text>
        <v-form ref="form">
            <v-text-field v-model="task.description" label="What task do you want to accomplish?"
                :rules="[ruleMinimumFiveChars]" aria-label="description" :placeholder="task.description" required />
            <div class="padded">
                <Slider v-model="task.mES" custom-color="purple" step="10" icon="mdi-brain"
                    v-bind:human-readable-effort-value="mentalEffortPoints" aria-label="required mental effort" />
                <Slider v-model="task.pES" custom-color="#EED202" step="10" icon="mdi-account-hard-hat"
                    v-bind:human-readable-effort-value="physicalEffortPoints"
                    aria-label="required physical mental effort" />
                <TimeInvestmentInput :value=task.length v-model="task.length" :rules="[ruleMinimumFiveMinutes]" />
                <div class="error" v-show="timeError">
                    {{ timeError }}
                </div>
            </div>
            <v-card-actions class="justify-end">
                <v-btn @click="$emit('discard')" prepend-icon="mdi-close" variant="text"
                    aria-label="discard task">Discard</v-btn>
                <v-btn @click="validate" prepend-icon="mdi-content-save" color="green" variant="text"
                    aria-label="save task">Save</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script lang="ts">
import { TimeInMillis, toSubjectiveEffortScore, type TaskType } from '@/middleware/helpers';
import Slider from './Slider.vue';
import TimeInvestmentInput from './TimeInvestmentInput.vue';

export default {
    props: ['modelValue'],
    emits: ['update:modelValue', 'discard'],
    data() {
        return {
            task: this.modelValue as TaskType,
            timeError: "",
        };
    },
    methods: {
        ruleMinimumFiveChars: (value: string) => (value || '').length >= 5 || 'Minimum 5 characters text',
        ruleMinimumFiveMinutes: (value: number) => {
            if (value > 5 * TimeInMillis.Minute) {
                return true;
            }
            return 'time required should be at least 5 minutes';
        },
        async validate() {
            const { valid } = await (this.$refs.form as any).validate()

            if (valid) {
                this.$emit('update:modelValue', this.task);
            }
        },
    },
    computed: {
        mentalEffortPoints() {
            return toSubjectiveEffortScore(this.task.mES);
        },
        physicalEffortPoints() {
            return toSubjectiveEffortScore(this.task.pES);
        }
    },
    components: {
        Slider: Slider,
        TimeInvestmentInput: TimeInvestmentInput,
    },
    watch: {
        'task.length'(len: number) {
            const validationResult = this.ruleMinimumFiveMinutes(len);
            this.timeError = validationResult === true ? "" : validationResult;
        }
    }
}
</script>
<template>
    <GenericItemEditCardVue :item="task" item-type="TASK" @save="onSave">
        <v-form ref="form" id="description">
            <v-textarea v-model="tempDescription" aria-label="description" :rules="[descriptionGEQ5Chars]"
                label="What to do?" density="compact" clearable />
        </v-form>
    </GenericItemEditCardVue>
</template>

<script lang="ts">
import DescriptiveItemType from '@/types/DescriptiveItemType';
import type ItemType from '@/types/ItemType';
import GenericItemEditCardVue from './GenericItemEditCard.vue';

export default {
    props: {
        task: {
            type: DescriptiveItemType,
            required: true,
        },
    },
    data() {
        return {
            tempDescription: this.task.description,
        };
    },
    methods: {
        descriptionGEQ5Chars(value: string): true | string {
            if ((value || '').length >= 5) {
                return true;
            }
            return "description must be 5 or more characters";
        },
        async onSave(item: ItemType) {
            const { valid } = await (this.$refs.form as any).validate();
            if (valid) {
                const updatedTask: DescriptiveItemType = new DescriptiveItemType(
                    item.id, item.length, item.pES, item.mES, this.tempDescription
                );
                this.$emit("save", updatedTask);
            }
        }
    },
    components: { GenericItemEditCardVue, },
    emits: ['save'],
}
</script>

<style scoped>
#description {
    padding: 0.5rem;
}
</style>
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type DescriptiveItemType from '@/types/DescriptiveItemType';

export const usePlannerStore = defineStore('planner', () => {    
    const id = ref<number>(0);
    const tasks = ref<Array<DescriptiveItemType>>([]);

    function getTasks(): Array<DescriptiveItemType> {
        return tasks.value;
    }

    function createTask(idLessTask: DescriptiveItemType) {       
        const newTask = {...idLessTask, id: id.value.toString()};
        tasks.value.push(newTask);
        id.value++;
    }

    return { getTasks, createTask };
});
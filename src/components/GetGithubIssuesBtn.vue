<template>
    <v-btn id="fetch-from-git" :loading="fetching" @click="doFetch">
        <v-icon icon="mdi-github"></v-icon>
        <div class="error" v-if="error">{{ error }}</div>
    </v-btn>
</template>

<script setup lang="ts">
import type { TaskType } from '@/middleware/helpers';
import { useScheduleItemsStore } from '@/stores/scheduleItems';
import { ref } from 'vue'

const error = ref<string | null>(null);
const fetching = ref<boolean>(false);

const store = useScheduleItemsStore();

function doFetch() {
    fetching.value = true;
    error.value = null;
    fetch('https://api.github.com/repos/aws/copilot-cli/issues')
        .then((res) => res.json())
        .then((json: any[]) => {
            const dirtyTasks = json.map(jsonObjToTask);

            dirtyTasks.forEach(task => store.addTask(task));
        })
        .catch((err) => (error.value = err))
        .then(_ => fetching.value = false);
}

function jsonObjToTask(json: any): TaskType {
    const task: TaskType = {
        description: json['title'],
        id: "",
        length: 0,
        mES: 0,
        pES: 0,
    };

    return task;
}
</script>

<style scoped>
@import url(../assets/main.css);
</style>
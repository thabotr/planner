<script lang="ts">
export default {
    data () {
        return {count: 0};
    },
    methods: {
        createPlanItem() {
            this.count++;
        },
    }
}
</script>
<template>
    <div>{{count}}</div>
    <v-btn
        id="create-plan-item" 
        @click="createPlanItem"
        icon="mdi-pen-plus" 
        color="green" 
    >
    </v-btn>
</template>
<style scoped>
#create-plan-item {
    position: fixed;
    right: 3rem;
    bottom: 3rem;
}
</style>
<template>
    <v-card>
        <v-icon draggable="true" icon="mdi-drag"></v-icon>
        <v-chip color="primary" size="x-small">{{ id }}</v-chip>
    </v-card>
</template>

<script lang="ts">

export default {
    props: {
        id: String,
    }
}

</script>

<style scope>
.v-card {
    padding: 2px;
}

[draggable] {
    cursor: pointer;
}
</style>
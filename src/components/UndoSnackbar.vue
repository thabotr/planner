<template>
    <v-snackbar v-model="showSnackBar" :timeout="snackBarTimeout" vertical>
    {{ summary }}
    <h2>{{ description }}</h2>
    <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="showSnackBar = false">
            Close
        </v-btn>
        <v-btn color="green" variant="elevated" append-icon="mdi-undo" @click="$emit("onUndo")">
            Undo
        </v-btn>
    </template>
</v-snackbar>
</template>

<script lang="ts">
export default {
    props: {
        summary: String,
        description: String,
        show: Boolean,
    },
    data() {
        return {
            snackBarTimeout: 3000,
            showSnackBar: true,
        }
    },
    methods: {
        onClose() {this.hideSnackBar();},
        hideSnackBar() {this.showSnackBar = false;}
    }
};
</script>
<template>
    <div>
        <v-list-item>
            <template v-slot:prepend>
                <v-icon icon="mdi-brain" id="i-mental"></v-icon>
            </template>
            <v-list-item-title>{{ mEP }} mental EP</v-list-item-title>
        </v-list-item>

        <v-list-item>
            <template v-slot:prepend>
                <v-icon icon="mdi-account-hard-hat" id="i-physical"></v-icon>
            </template>
            <v-list-item-title>{{ pEP }} physical EP</v-list-item-title>
        </v-list-item>

        <v-list-item>
            <template v-slot:prepend>
                <v-icon icon="mdi-timer" id="i-time"></v-icon>
            </template>
            <v-list-item-title>{{ time }}</v-list-item-title>
        </v-list-item>
    </div>
</template>

<script lang="ts">
import { toSubjectiveEffortScore, verboseTimestamp } from '@/middleware/helpers';

export default {
    data() {
        return {
            mES: 0,
            pES: 0,
            length: 0,
        };
    },
    computed: {
        mEP() { return toSubjectiveEffortScore(this.mES); },
        pEP() { return toSubjectiveEffortScore(this.pES); },
        time() { return verboseTimestamp(this.length); }
    }
}
</script>

<style scoped>
.v-list-item #i-mental {
    color: var(--color-brain);
}
.v-list-item #i-physical {
    color: var(--color-worker);
}
.v-list-item #i-time {
    color: var(--color-timer);
}
</style>
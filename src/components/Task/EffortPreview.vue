<template>
    <div class="flex-vertical">
        <div class="flex-horizontal">
            <v-icon icon="mdi-brain" id="i-mental" />
            <slot name="before-mep"></slot>{{ mEP }} mental EP
        </div>
        <div class="flex-horizontal">
            <v-icon icon="mdi-account-hard-hat" id="i-physical" />
            <slot name="before-pep"></slot>{{ pEP }} physical EP
        </div>
        <div class="flex-horizontal">
            <v-icon icon="mdi-timer" id="i-time" />
            <slot name="before-time"></slot>{{ time }}
        </div>
    </div>
</template>

<script lang="ts">
import { toSubjectiveEffortScore, verboseTimestamp } from '@/middleware/helpers';
import ItemType from '@/types/ItemType';
export default {
    props: {
        item: {
            type: ItemType,
            required: true,
        }
    },
    computed: {
        mEP() { return toSubjectiveEffortScore(this.item.mES); },
        pEP() { return toSubjectiveEffortScore(this.item.pES); },
        time() { return verboseTimestamp(this.item.length); }
    }
}
</script>

<style scoped>
.v-chip {
    border-radius: 0.1rem;
}

#i-mental {
    color: var(--color-brain);
}

#i-physical {
    color: var(--color-worker);
}

#i-time {
    color: var(--color-timer);
}
</style>
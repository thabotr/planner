<script setup lang="ts">
import ThePlanner from '@/components/ThePlanner.vue';
import TheTasks from '../components/TheTasks.vue'
</script>

<template>
  <main class="padded">
    <div id="the-tasks" class="padded">
      <TheTasks />
    </div>
    <div id="the-calendar" class="padded">
      <ThePlanner @error="onError"/>
    </div>
    <v-snackbar v-model="snackbar" vertical>
      <h2 class="centered-content error">{{ notification.type }}</h2>

      <p>{{ notification.message }}</p>

      <template v-slot:actions>
        <v-btn color="indigo" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {
      snackbar: false,
      notification: {
        type: "Error",
        message: "Error message",
      }
    };
  },
  methods: {
    onError(
      notif: {
        type: string,
        message: string,
      }
    ) {
      this.notification = notif;
      this.snackbar = true;
    }
  }
}
</script>
 
<style scoped>
main {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#the-calendar {
  border-left: 2px solid gray;
}

.padded {
  padding: 1rem;
}

.error {
  color: red;
}
</style>
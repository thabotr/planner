<script setup lang="ts">
import TheCalendar from '@/components/TheCalendar.vue';
import TheTasks from '../components/TheTasks.vue'
</script>

<template>
  <main class="padded">
    <div id="the-tasks" class="padded">
      <TheTasks />
    </div>
    <div id="the-calendar" class="padded">
      <TheCalendar />
    </div>
  </main>
</template>
 
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
</style>
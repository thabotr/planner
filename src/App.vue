<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <main>
    <header>
      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/plan">Plan</RouterLink>
        <RouterLink to="/plan/2">Plan2</RouterLink>
      </nav> -->
    </header>
    <div id="content">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  width: 100vw;
  border: 2px solid greenyellow;
  left: 0;
  top: 0;
  position: absolute;
  display: flex;
}

header {
  box-sizing: border-box; /* for inner border */
  border: 2px solid orange;
  width: 6rem;
  height: 100%;
}

#content {
  border: 2px solid pink;
  box-sizing: border-box; /* for inner border */
  flex: 1;
}

/* --tablet-width: 1024px; */
@media (max-width: 1024px) {
  main {
    flex-direction: column;
  }
  header {
    height: 6rem;
    width: 100%;
  }
}

/* --large-mobile-width: 430px; */
@media(max-width: 430px) {
  header {
    height: 4rem;
  }
}

/* nav {
  text-align: left;
  gap: 2rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
}

nav a:first-of-type {
  border: 0;
} */
</style>

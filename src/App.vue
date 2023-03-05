<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/plan">Plan</RouterLink>
      </nav>
  </header>
  <div id="content">
    <RouterView />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 6rem;
  border-right: 2px solid green;
  padding-block: 2rem;
  width: 6rem;
}

#content {
  position: fixed;
  left: 6rem;
}

@media(min-width: 420px) {
  #content {
    position: relative;
  }
}

@media(max-width: 420px) {
  header {
    display: none;
  }
}

nav {
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
}
</style>

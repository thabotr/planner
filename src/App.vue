<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <main>
    <nav>
      <div id="links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/plan">Plan</RouterLink>
        <RouterLink to="/plan/2">Plan2</RouterLink>
      </div>
      <button class="mobile-only">Nav Menu</button>
      <button class="mobile-only">Create Item Menu</button>
    </nav>
    <div id="content">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
@import url(./assets/base.css);
main {
  height: 100vh;
  width: 100vw;
  border: 2px solid greenyellow;
  left: 0;
  top: 0;
  position: absolute;
  display: flex;
}

nav {
  box-sizing: border-box;
  /* for inner border */
  border: 2px solid orange;
  width: 6rem;
  height: 100%;
  background-color: var(--color-primary);
}

nav,
#links {
  flex-direction: column;
  display: flex;
  gap: 1rem;
}

#content {
  border: 2px solid pink;
  box-sizing: border-box;
  /* for inner border */
  flex: 1;
  background-color: var(--color-bg);
}

.mobile-only {
  display: none;
}

/* --tablet-width: 1024px; */
@media (max-width: 1024px) {
  main {
    flex-direction: column;
  }

  nav {
    height: 6rem;
    width: 100%;
  }

  nav,
  #links {
    flex-direction: row;
  }
}

/* --large-mobile-width: 430px; */
@media(max-width: 430px) {
  .mobile-only {
    display: initial;
  }

  #links {
    display: none;
  }

  nav {
    height: 4rem;
  }
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

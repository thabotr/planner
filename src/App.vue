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
    <div id="content" class="hlt-1">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
@import url(./assets/base.css);

main {
  height: 100vh;
  width: 100vw;
  left: 0;
  top: 0;
  position: absolute;
  display: flex;
}

nav {
  box-sizing: border-box;
  width: 6rem;
  height: 100%;
  background-color: var(--color-primary);
  border-right: 2px solid var(--color-accent);
}

nav,
#links {
  flex-direction: column;
  display: flex;
  gap: 2rem;
}

#content {
  flex: 1;
  background-color: var(--color-bg);
  display: grid;
  padding: 0 1rem 0 1rem;

  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
}

.mobile-only {
  display: none;
}

@media (min-width: 1024px) {
  nav {
    padding-block: 6rem;
  }

  #content {
    padding: 4rem 6% 4rem 1rem;
  }
}

/* --tablet-width: 1024px; */
@media (max-width: 1024px) {
  main {
    flex-direction: column;
  }

  nav {
    height: 6rem;
    width: 100%;
    align-items: center;
    border-bottom: 2px solid var(--color-accent);
    border-right: none;
  }

  nav,
  #links {
    flex-direction: row;
  }

  #content {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
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

  #content {
    grid-template-columns: 1fr;
  }
}

nav a.router-link-exact-active {
  color: var(--color-highlight);
}

nav a:hover {
  background-color: var(--color-bg);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  color: var(--color-secondary);
  font-size: large;
}

nav a:first-of-type {
  border: 0;
}
</style>

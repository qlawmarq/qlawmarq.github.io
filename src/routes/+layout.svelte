<script lang="ts">
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
  import "./reset.css";
  import "./layout.css";
</script>

<div class="app">
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
</div>

<style>
  .app {
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  main {
    margin: auto;
    min-height: calc(100vh - 12rem);
    padding: 1rem 2rem;
    max-width: 70%;
  }
  @media screen and (max-width: 959px) {
    main {
      max-width: 95%;
    }
  }
</style>

<script lang="ts">
  import type { Snippet } from "svelte";
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
  import "./reset.css";
  import "./layout.css";
  import { browser } from "$app/environment";
  import { locale, setLocale } from "../i18n/i18n-svelte";
  import { detectLocale } from "../i18n/i18n-util";
  import { loadAllLocales } from "../i18n/i18n-util.sync";
  import { navigatorDetector } from "typesafe-i18n/detectors";

  let { children }: { children: Snippet } = $props();

  loadAllLocales();

  if (browser) {
    const detectedLocale = detectLocale(navigatorDetector);
    setLocale(detectedLocale);
  } else {
    setLocale("en");
  }

  $effect(() => {
    if (browser) {
      document.documentElement.lang = $locale;
    }
  });
</script>

<div class="app">
  <Header />
  <main>
    {@render children?.()}
  </main>
  <Footer />
  <div class="up_left_image"></div>
  <div class="bottom_right_image"></div>
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
  .up_left_image {
    background-image: url(/images/circle_up_left.svg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: fixed;
    z-index: -999;
    left: 0;
    top: 0;
    height: 100%;
    width: calc(100vw / 2);
  }
  .bottom_right_image {
    background-image: url(/images/circle_bottom_right.svg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: fixed;
    z-index: -999;
    right: 0;
    bottom: 0;
    height: 100%;
    width: calc(100vw / 2);
  }
  @media screen and (max-width: 1023px) {
    main {
      max-width: 75%;
    }
  }
  @media screen and (max-width: 767px) {
    main {
      max-width: 95%;
    }
  }
  @media screen and (max-width: 599px) {
    main {
      max-width: 100%;
    }
  }
</style>

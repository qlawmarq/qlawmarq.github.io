<script lang="ts">
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
  import "./reset.css";
  import "./layout.css";
  import { onMount } from "svelte";
  import { locale, setLocale } from "../i18n/i18n-svelte";
  import { detectLocale, isLocale, locales } from "../i18n/i18n-util";
  import { initLocalStorageDetector } from "typesafe-i18n/detectors";
  import { loadAllLocales, loadLocale } from "../i18n/i18n-util.sync";
  initLocalStorageDetector("key");
  setLocale("en");
  loadAllLocales();

  const getLocaleFromBrowser = () => {
    if (navigator.languages != undefined) return navigator.languages[0];
    return navigator.language;
  };

  onMount(async () => {
    const detectedLocale = getLocaleFromBrowser();
    if (isLocale(detectedLocale)) {
      setLocale(detectedLocale);
      document.querySelector("html")!.setAttribute("lang", detectedLocale);
    }
  });
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

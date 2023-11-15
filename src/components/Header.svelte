<script lang="ts">
  import { isLocale, locales } from "../i18n/i18n-util";
  import Select from "./Form/Select.svelte";
  import { locale, setLocale } from "../i18n/i18n-svelte";
  import Border from "./Border.svelte";
  let localeOptions = locales.map((l) => {
    return { value: l, text: l.toLocaleUpperCase() };
  });
  const onChange = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value;
    if (isLocale(value)) {
      setLocale(value);
      document.querySelector("html")!.setAttribute("lang", value);
    }
  };
</script>

<header>
  <div class="header__main">
    <div />
    <div class="header__logo" />
    <div>
      <Select
        id="locale"
        name="locale"
        ariaLabel="Select locale"
        options={localeOptions}
        value={$locale}
        onchange={(e) => onChange(e)}
      />
    </div>
  </div>
  <Border />
</header>

<style>
  header {
    position: relative;
    margin: auto;
    height: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
  }
  .header__main {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
  }
  .header__main > div {
    min-width: 50px;
  }
  .header__logo {
    margin: 0.5rem 0;
    height: 3rem;
    width: 3rem;
    background-image: url(/images/logo.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
</style>

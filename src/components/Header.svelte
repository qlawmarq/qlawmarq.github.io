<script lang="ts">
  import line from "$lib/images/line.svg";
  import { isLocale, locales } from "../i18n/i18n-util";
  import Select from "./Form/Select.svelte";
  import { locale, setLocale } from "../i18n/i18n-svelte";
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
    <div />
    <div>
      <Select
        id="locale"
        name="locale"
        options={localeOptions}
        value={$locale}
        onchange={(e) => onChange(e)}
      />
    </div>
  </div>
  <div class="header__border">
    <img src={line} alt="line" />
  </div>
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
    padding: 0 2rem;
  }
  .header__border {
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
  }
</style>

<script lang="ts">
  interface ExtendedHTMLSelectElement extends Omit<
    HTMLSelectElement,
    "options"
  > {
    options: { text: string; value: string }[];
  }
  interface $$Props extends Partial<ExtendedHTMLSelectElement> {}
</script>

<select
  value={$$props.value}
  aria-label={$$props.ariaLabel}
  {...$$props}
  on:change={(e) => $$props.onchange(e)}
>
  {#each $$props.options as option (option.value)}
    <option value={option.value}>{option.text}</option>
  {/each}
</select>

<style>
  select {
    padding: 0.5rem;
    padding-right: 0.75rem;
    font-size: 1em;
    border: none;
    outline: none;
    appearance: auto;
    border-radius: 0;
    background-color: #d1cdb7;
    color: inherit;
    font-family: inherit;
    letter-spacing: inherit;
    font-weight: inherit;
    cursor: pointer;
  }
</style>

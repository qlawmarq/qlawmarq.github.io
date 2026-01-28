<script lang="ts">
  import type { HTMLSelectAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLSelectAttributes, "value"> {
    options: { text: string; value: string }[];
    value?: string;
    onchange?: (e: Event) => void;
  }

  let { options, value, onchange, ...rest }: Props = $props();
</script>

<select {value} {...rest} {onchange}>
  {#each options as option (option.value)}
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

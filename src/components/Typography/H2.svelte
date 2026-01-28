<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLHeadingElement> {
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<h2 {...rest}>
  {@render children?.()}
</h2>

<style>
  h2 {
    font-size: 1.5rem;
    padding: 0.1rem 1rem;
    margin-bottom: 0.5rem;
    font-weight: lighter;
    border: solid #454138;
    border-width: 0.1rem 0;
    letter-spacing: 0.25rem;
  }
</style>

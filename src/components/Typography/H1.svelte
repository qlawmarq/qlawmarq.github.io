<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLHeadingElement> {
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<h1 {...rest}>
  {@render children?.()}
</h1>

<style>
  h1 {
    padding-bottom: 0.85rem;
    text-transform: uppercase;
    font-size: 2rem;
    font-weight: lighter;
    letter-spacing: 0.7rem;
    text-shadow: 0.3rem 0.3rem 0 rgba(77, 73, 62, 0.3);
  }
</style>

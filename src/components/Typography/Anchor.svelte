<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  interface Props extends HTMLAnchorAttributes {
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<a {...rest}>
  {@render children?.()}
</a>

<style>
  a {
    text-decoration: underline;
    cursor: pointer;
    transition: all 0.2s ease-out;
  }
  a:hover {
    opacity: 0.7;
  }
</style>

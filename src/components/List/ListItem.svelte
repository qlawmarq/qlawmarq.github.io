<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLLiAttributes } from "svelte/elements";

  interface Props extends HTMLLiAttributes {
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<li {...rest}>
  {@render children?.()}
</li>

<style>
  li {
    line-height: 1.2;
    padding: 0.25rem 0;
  }
</style>

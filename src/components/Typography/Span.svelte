<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<span {...rest}>
  {@render children?.()}
</span>

<style>
  span {
    font-size: 0.75rem;
  }
</style>

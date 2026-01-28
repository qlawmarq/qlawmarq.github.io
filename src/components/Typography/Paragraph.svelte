<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLParagraphElement> {
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<p {...rest}>
  {@render children?.()}
</p>

<style>
  p {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
</style>

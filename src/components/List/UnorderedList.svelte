<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLUListElement> {
    children?: Snippet;
  }

  let { children, ...rest }: Props = $props();
</script>

<ul {...rest}>
  {@render children?.()}
</ul>

<style>
  ul {
    list-style-type: square;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
  }
</style>

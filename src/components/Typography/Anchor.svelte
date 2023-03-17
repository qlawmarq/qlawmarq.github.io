<script lang="ts">
  interface $$Props extends Partial<HTMLAnchorElement> {}
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a {...$$props}>
  <slot />
</a>

<style>
  a {
    text-decoration: underline;
    cursor: pointer;
    transition: all 0.2s ease-out;
  }
  a :hover {
    opacity: 0.7;
  }
</style>

<script lang="ts">
  interface $$Props extends svelteHTML.HTMLAttributes<HTMLLIElement> {}
</script>

<li {...$$props}>
  <slot />
</li>

<style>
  li {
    line-height: 1.2;
    padding: 0.25rem 0;
  }
</style>

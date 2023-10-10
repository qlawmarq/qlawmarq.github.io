<script lang="ts">
  interface $$Props extends svelteHTML.HTMLAttributes<HTMLUListElement> {}
</script>

<ul {...$$props}>
  <slot />
</ul>

<style>
  ul {
    list-style-type: square;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
  }
</style>

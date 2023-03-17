<script lang="ts">
  interface $$Props extends svelteHTML.HTMLAttributes<HTMLHeadingElement> {}
</script>

<h1 {...$$props}>
  <slot />
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

<script lang="ts">
  interface $$Props extends svelteHTML.HTMLAttributes<HTMLHeadingElement> {}
</script>

<h2 {...$$props}>
  <slot />
</h2>

<style>
  h2 {
    font-size: 1.5rem;
    padding: 0.1rem 1rem;
    font-weight: lighter;
    border: solid #454138;
    border-width: 0.1rem 0;
    letter-spacing: 0.25rem;
  }
</style>

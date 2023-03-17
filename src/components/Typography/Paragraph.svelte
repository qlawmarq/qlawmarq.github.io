<script lang="ts">
  interface $$Props extends svelteHTML.HTMLAttributes<HTMLParagraphElement> {}
</script>

<p {...$$props}>
  <slot />
</p>

<style>
  p {
    font-size: 1rem;
    margin: 1rem 0;
  }
</style>

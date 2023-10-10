<script lang="ts">
  interface $$Props extends svelteHTML.HTMLAttributes<HTMLParagraphElement> {}
</script>

<p {...$$props}>
  <slot />
</p>

<style>
  p {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
</style>

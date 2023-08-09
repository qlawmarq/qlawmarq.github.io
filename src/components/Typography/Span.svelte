<script lang="ts">
  interface $$Props extends svelteHTML.HTMLAttributes<HTMLSpanElement> {}
</script>

<span {...$$props}>
  <slot />
</span>

<style>
  span {
    font-size: 0.75rem;
  }
</style>

<script>
  import Border from "./Border.svelte";
  import Anchor from "./Typography/Anchor.svelte";
  import Span from "./Typography/Span.svelte";
</script>

<footer>
  <Border />
  <div class="footer__main">
    <Span>© 2023 Masaki Yoshiiwa</Span>
    <br />
    <Span
      ><Anchor
        href={"https://github.com/qlawmarq/qlawmarq.github.io"}
        target="_blank"
        rel="noopener noreferrer">Check the code on GitHub.</Anchor
      ></Span
    >
  </div>
</footer>

<style>
  footer {
    position: relative;
    margin: auto;
    height: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
  }
  .footer__main {
    margin: auto;
    margin-bottom: 2rem;
    text-align: center;
  }
</style>

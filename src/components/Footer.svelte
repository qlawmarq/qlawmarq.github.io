<script>
  import line from "$lib/images/line.svg";
  import Anchor from "./Typography/Anchor.svelte";
  import Span from "./Typography/Span.svelte";
</script>

<footer>
  <div class="footer__border">
    <img src={line} alt="line" />
  </div>
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
    text-align: center;
  }
  .footer__border {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
  }
</style>

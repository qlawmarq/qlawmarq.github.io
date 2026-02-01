<script>
  import Border from "./Border.svelte";
</script>

<footer>
  <Border />
  <div class="footer__main">
    <span class="text-small">© 2023 Masaki Yoshiiwa</span>
    <br />
    <span class="text-small"
      ><a
        href="https://github.com/qlawmarq/qlawmarq.github.io"
        target="_blank"
        rel="noopener noreferrer">Check the code on GitHub.</a
      ></span
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

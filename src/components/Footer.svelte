<script>
  import line from "$lib/images/line.svg";
</script>

<footer>
  <div class="footer__border">
    <img src={line} alt="line" />
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

  .footer__border {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
  }
</style>

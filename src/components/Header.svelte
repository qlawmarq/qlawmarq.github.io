<script>
  import line from "$lib/images/line.svg";
</script>

<header>
  <div class="header__main" />
  <div class="header__border">
    <img src={line} alt="line" />
  </div>
</header>

<style>
  header {
    position: relative;
    margin: auto;
    height: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
  }
  .header__main {
    margin: auto;
  }
  .header__border {
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
  }
</style>

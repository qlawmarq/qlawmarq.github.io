<script lang="ts">
</script>

<div class="border_wrapper">
  <div></div>
</div>

<style>
  .border_wrapper {
    border-top: 1px solid #454138;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 0.125fr 4fr 0.125fr;
    grid-template-areas: ". background .";
  }
  .border_wrapper > div {
    grid-area: background;
    display: block;
    background-image: url(/images/border.png);
    background-repeat: repeat-x;
  }
</style>

<div class="card">
  <slot />
</div>

<style>
  @keyframes slidein {
    0% {
      opacity: 0;
      transform: translateX(25px);
    }
    100% {
      opacity: 1;
      transform: translateX(0px);
    }
  }
  .card {
    position: relative;
    flex-direction: column;
    margin: 1rem 0;
    background-color: #dcd8c0;
    padding: 0.5rem;
    padding-left: 2rem;
    box-shadow: 0.2em 0.2em #bab5a1;
    animation: slidein 0.5s ease-in-out 0s 1 normal;
  }
  .card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 0.3rem;
    padding: 0.15rem;
    border: solid #454138;
    border-width: 0 0.2rem 0 0.6rem;
    transition: all 0.2s ease-out;
  }
</style>

<span class="badge">
  <slot />
</span>

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
  .badge {
    display: inline-block;
    margin: 0 0.5rem 0 0;
    padding: 0.25rem 0.5rem;
    line-height: 1;
    text-decoration: none;
    font-size: 0.75rem;
    background-color: #bab5a1;
    border-left: 0.25rem solid #454138;
    animation: slidein 0.5s ease-in-out 0s 1 normal;
  }
</style>

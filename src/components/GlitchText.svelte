<script lang="ts">
  import { onMount } from "svelte";
  export let text: string;
  export let factor: number = 5;
  export let delay: number = 0;
  export let maxMilsec: number = 120;
  export let minMilsec: number = 20;
  export let onFinish: () => void = () => {};
  const randamString = "______!<>-\\/[]{}—=+*^?#";
  let output = "";
  let counter = -1;
  onMount(() => {
    delay = delay ? delay : 0;
    setTimeout(() => {
      for (let i = 0; i < text.length + factor; i++) {
        output += getRandamString();
      }
      glicth();
    }, delay);
  });

  const getRandamString = () => {
    return randamString.charAt(Math.floor(Math.random() * randamString.length));
  };

  const glicth = () => {
    setTimeout(() => {
      counter++;
      if (counter < text.length) {
        const cipherChars = [...output];
        for (let i = counter; i < text.length + factor; i++) {
          cipherChars[i] = getRandamString();
        }
        if (counter + 1 == text.length) {
          for (let j = text.length; j < text.length + factor; j++) {
            cipherChars[j] = "";
          }
          onFinish();
        }
        cipherChars[counter] = text[counter];
        output = cipherChars.join("");
        glicth();
      }
    }, Math.floor(Math.random() * (maxMilsec - minMilsec) + minMilsec));
  };
</script>

{output}

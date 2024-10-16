<script lang="ts">
  export let text: string;
  export let factor: number = 5;
  export let delay: number = 0;
  export let maxMilsec: number = 120;
  export let minMilsec: number = 20;
  export let onFinish: () => void = () => {};
  const randamString = "______!<>-\\/[]{}—=+*^?#";
  let output = text;
  let isFinished = false;
  let isStarted = false;
  let counter = -1;
  $: text?.length && renderGlitchText();

  const renderGlitchText = () => {
    isStarted = true;
    output = "";
    delay = delay ? delay : 0;
    setTimeout(() => {
      for (let i = 0; i < text.length + factor; i++) {
        output += getRandamString();
      }
      glitch();
    }, delay);
  };

  const getRandamString = () => {
    return randamString.charAt(Math.floor(Math.random() * randamString.length));
  };

  const glitch = () => {
    isFinished = false;
    setTimeout(
      () => {
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
          glitch();
        } else {
          isFinished = true;
        }
      },
      Math.floor(Math.random() * (maxMilsec - minMilsec) + minMilsec),
    );
  };
</script>

{isStarted ? output : text}

<script lang="ts">
  interface Props {
    text: string;
    factor?: number;
    delay?: number;
    maxMilsec?: number;
    minMilsec?: number;
    onFinish?: () => void;
  }

  let {
    text,
    factor = 5,
    delay = 0,
    maxMilsec = 120,
    minMilsec = 20,
    onFinish = () => {},
  }: Props = $props();

  const randamString = "______!<>-\\/[]{}—=+*^?#";
  // svelte-ignore state_referenced_locally
  let output = $state(text);
  let isStarted = $state(false);
  let counter = $state(-1);
  let animationId = 0;

  $effect(() => {
    if (text?.length) {
      const currentId = ++animationId;
      isStarted = true;
      counter = -1;
      output = "";
      setTimeout(() => {
        if (currentId !== animationId) return;
        for (let i = 0; i < text.length + factor; i++) {
          output += getRandamString();
        }
        glitch(currentId);
      }, delay || 0);
    }
  });

  const getRandamString = () => {
    return randamString.charAt(Math.floor(Math.random() * randamString.length));
  };

  const glitch = (id: number) => {
    setTimeout(
      () => {
        if (id !== animationId) return;
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
          glitch(id);
        }
      },
      Math.floor(Math.random() * (maxMilsec - minMilsec) + minMilsec),
    );
  };
</script>

{isStarted ? output : text}

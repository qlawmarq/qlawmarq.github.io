<script lang="ts">
  import { onMount } from "svelte";
  import Content from "../components/Content.svelte";
  import GlitchText from "../components/GlitchText.svelte";
  import ListItem from "../components/List/ListItem.svelte";
  import UnorderedList from "../components/List/UnorderedList.svelte";
  import Anchor from "../components/Typography/Anchor.svelte";
  import H1 from "../components/Typography/H1.svelte";
  import Paragraph from "../components/Typography/Paragraph.svelte";
  import isbot from "isbot";
  import LL, { locale } from "../i18n/i18n-svelte";
  let isTextFinished: boolean = true;
  $: console.log($locale);
  onMount(() => {
    // If user is bot, then skip glitching list elements.
    if (isbot(navigator.userAgent)) {
      isTextFinished = true;
    } else {
      isTextFinished = false;
    }
  });
</script>

<svelte:head>
  <title>Profile - {$LL.name() || "Masaki Yoshiiwa"} (@qlawmarq)</title>
  <meta
    name="description"
    content="GitHub Profile Page of Masaki Yoshiiwa (@qlawmarq), a software developer who loves new technologies."
  />
</svelte:head>

<section>
  <H1>
    <GlitchText text={$LL.hello()} factor={4} minMilsec={30} />
  </H1>

  {#key $locale}
    <Content>
      <Paragraph>
        Name:
        <GlitchText text={$LL.name()} factor={2} delay={300} />
      </Paragraph>
      <Paragraph>
        Job:
        <GlitchText text={$LL.job()} factor={0} delay={800} maxMilsec={80} />
      </Paragraph>
      <Paragraph>
        Introduce:
        <GlitchText
          text={$LL.introduce()}
          factor={0}
          delay={1600}
          maxMilsec={70}
          onFinish={() => (isTextFinished = true)}
        />
      </Paragraph>
      {#if isTextFinished}
        <UnorderedList>
          <ListItem>
            <Anchor
              href={"https://github.com/qlawmarq"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GlitchText text={"GitHub"} factor={8} delay={100} />
            </Anchor>
          </ListItem>
          <ListItem>
            <Anchor
              href={"https://www.linkedin.com/in/qlawmarq/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GlitchText text={"LinkdIn"} factor={8} delay={200} />
            </Anchor>
          </ListItem>
          <ListItem>
            <Anchor href="mailto:masaki.yoshiiwa@gmail.com">
              <GlitchText text={"Email"} factor={8} delay={100} />
            </Anchor>
          </ListItem>
          <ListItem>
            <Anchor
              href={$LL.rejumeUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GlitchText text={"Rejume"} factor={8} delay={200} />
            </Anchor>
          </ListItem>
        </UnorderedList>
      {/if}
    </Content>
  {/key}
</section>

<style>
</style>

<script lang="ts">
  import Content from "../components/Content.svelte";
  import GlitchText from "../components/GlitchText.svelte";
  import ListItem from "../components/List/ListItem.svelte";
  import UnorderedList from "../components/List/UnorderedList.svelte";
  import Anchor from "../components/Typography/Anchor.svelte";
  import H1 from "../components/Typography/H1.svelte";
  import Paragraph from "../components/Typography/Paragraph.svelte";

  let isTextFinished = false;
</script>

<svelte:head>
  <title>HOME - qlawmarq.github.io</title>
  <meta name="description" content="A portfolio site created with Svelte" />
</svelte:head>

<section>
  <H1>
    <GlitchText text={"Hello"} factor={4} minMilsec={60} />
  </H1>
  <Content>
    <Paragraph>
      <GlitchText text={`I'm Masa.`} factor={2} delay={1000} />
    </Paragraph>
    <Paragraph>
      <GlitchText
        text={"Full stack developer, primarily front-end developer."}
        factor={0}
        delay={2000}
        maxMilsec={80}
      />
    </Paragraph>
    <Paragraph>
      <GlitchText
        text={"Passionate about solving interesting problems, and finding new technologies to learn."}
        factor={0}
        delay={5000}
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
      </UnorderedList>
    {/if}
  </Content>
</section>

<style>
</style>

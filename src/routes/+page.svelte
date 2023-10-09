<script lang="ts">
  import { onMount } from "svelte";
  import Card from "../components/Card.svelte";
  import GlitchText from "../components/GlitchText.svelte";
  import ListItem from "../components/List/ListItem.svelte";
  import UnorderedList from "../components/List/UnorderedList.svelte";
  import Anchor from "../components/Typography/Anchor.svelte";
  import H1 from "../components/Typography/H1.svelte";
  import Paragraph from "../components/Typography/Paragraph.svelte";
  import isbot from "isbot";
  import LL, { locale } from "../i18n/i18n-svelte";
  import ky from "ky";
  import type { GitHubRepo } from "../types/github";
  import H2 from "../components/Typography/H2.svelte";

  let isTextFinished: boolean = true;
  let ownedRepos: GitHubRepo[] = [];

  onMount(() => {
    checkUserAgent();
    fettchData();
  });

  const checkUserAgent = () => {
    // If user is bot, then skip glitching list elements.
    if (isbot(navigator.userAgent)) {
      isTextFinished = true;
    } else {
      isTextFinished = false;
    }
  };

  // Fetch own repo datas in GitHub from GitHub API
  const fettchData = async () => {
    const allRepos: GitHubRepo[] = await ky
      .get("https://api.github.com/users/qlawmarq/repos", {
        searchParams: new URLSearchParams({
          type: "public",
          sort: "updated",
          per_page: "50",
        }),
      })
      .json();
    ownedRepos = allRepos.filter(
      (repo) =>
        repo.fork === false &&
        repo.description !== null &&
        repo.description !== "",
    );
  };
</script>

<svelte:head>
  <title>Profile - {$LL.name() || "Masaki Yoshiiwa"}</title>
  <meta name="title" content="Profile - {$LL.name() || 'Masaki Yoshiiwa'} " />
  <meta
    name="description"
    content="GitHub Profile Page of Masaki Yoshiiwa , a software developer who loves new technologies."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://qlawmarq.github.io/" />
  <meta
    property="og:title"
    content="Profile - {$LL.name() || 'Masaki Yoshiiwa'} "
  />
  <meta
    property="og:description"
    content="GitHub Profile Page of Masaki Yoshiiwa , a software developer who loves new technologies."
  />
  <meta property="og:image" content="https://qlawmarq.github.io/icon.png" />
</svelte:head>

<section>
  <H1>
    <GlitchText text={$LL.hello()} factor={4} minMilsec={30} />
  </H1>

  {#key $locale}
    <Card>
      <H2>About</H2>
      <Paragraph>
        Name:
        <GlitchText text={$LL.name()} factor={2} delay={300} />
      </Paragraph>
      <Paragraph>
        Job:
        <GlitchText text={$LL.job()} factor={0} delay={600} maxMilsec={80} />
      </Paragraph>
      <Paragraph>
        Bio:
        <GlitchText
          text={$LL.introduce()}
          factor={0}
          delay={1200}
          maxMilsec={50}
          onFinish={() => (isTextFinished = true)}
        />
      </Paragraph>
    </Card>
    <Card>
      <H2>Contacts</H2>
      <UnorderedList>
        <ListItem>
          <Anchor
            href={"https://github.com/qlawmarq"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlitchText text={"GitHub"} factor={8} delay={300} />
          </Anchor>
        </ListItem>
        <ListItem>
          <Anchor
            href={"https://www.linkedin.com/in/qlawmarq/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlitchText text={"LinkdIn"} factor={8} delay={400} />
          </Anchor>
        </ListItem>
        <ListItem>
          <Anchor href="mailto:masaki.yoshiiwa@gmail.com">
            <GlitchText text={"Email"} factor={8} delay={500} />
          </Anchor>
        </ListItem>
        <ListItem>
          <Anchor
            href={$LL.resumeUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlitchText text={"Resume"} factor={8} delay={600} />
          </Anchor>
        </ListItem>
      </UnorderedList>
    </Card>
    <!-- show for each ownedRepos below -->
    <Card>
      <H2>Own GitHub Repositories</H2>
      <UnorderedList>
        {#each ownedRepos as repo}
          <ListItem>
            <Anchor
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GlitchText text={repo.name} factor={0} delay={0} />
            </Anchor>
            : <GlitchText
              text={repo.description}
              factor={0}
              delay={50}
              maxMilsec={40}
              minMilsec={10}
            />
          </ListItem>
        {/each}
      </UnorderedList>
    </Card>
  {/key}
</section>

<style>
</style>

<script lang="ts">
  import { onMount } from "svelte";
  import Card from "../components/Card.svelte";
  import GlitchText from "../components/GlitchText.svelte";
  import ListItem from "../components/List/ListItem.svelte";
  import UnorderedList from "../components/List/UnorderedList.svelte";
  import Anchor from "../components/Typography/Anchor.svelte";
  import H1 from "../components/Typography/H1.svelte";
  import Paragraph from "../components/Typography/Paragraph.svelte";
  import LL, { locale } from "../i18n/i18n-svelte";
  import ky from "ky";
  import type { GitHubRepo } from "../types/github";
  import H2 from "../components/Typography/H2.svelte";
  import Badge from "../components/Badge.svelte";
  import Star from "$lib/images/star.svg";
  import Span from "../components/Typography/Span.svelte";
  import ownedReposJSON from "../lib/json/ownedRepos.json";
  import starredReposJSON from "../lib/json/starredRepos.json";

  let ownedRepos: GitHubRepo[] = [];
  let starredRepos: GitHubRepo[] = [];

  onMount(() => {
    fetchOwnRepos();
    fetchRecentStaredRepos();
  });

  // Fetch own repo datas in GitHub from GitHub API
  const fetchOwnRepos = async () => {
    try {
      const allRepos = await ky
        .get("https://api.github.com/users/qlawmarq/repos", {
          searchParams: new URLSearchParams({
            type: "public",
            sort: "updated",
            per_page: "50",
          }),
        })
        .json<GitHubRepo[]>();
      ownedRepos = allRepos
        .filter(
          (repo) =>
            repo.fork === false &&
            repo.description !== null &&
            repo.description !== "" &&
            repo.stargazers_count > 1,
        )
        .sort((a, b) => {
          if (a.stargazers_count > b.stargazers_count) {
            return -1;
          } else if (a.stargazers_count < b.stargazers_count) {
            return 1;
          } else {
            return 0;
          }
        });
    } catch (error) {
      ownedRepos = ownedReposJSON as unknown as GitHubRepo[];
    }
  };

  // Fetch own repo datas in GitHub from GitHub API
  const fetchRecentStaredRepos = async () => {
    try {
      const allRepos = await ky
        .get("https://api.github.com/users/qlawmarq/starred", {
          searchParams: new URLSearchParams({
            per_page: "8",
          }),
        })
        .json<GitHubRepo[]>();
      starredRepos = allRepos;
    } catch (error) {
      starredRepos = starredReposJSON as unknown as GitHubRepo[];
    }
  };
</script>

<svelte:head>
  <title>Profile - {$LL.name() || "Masaki Yoshiiwa"}</title>
  <meta name="title" content="Profile - {$LL.name() || 'Masaki Yoshiiwa'} " />
  <meta
    name="description"
    content="GitHub Profile Page of Masaki Yoshiiwa, a software developer who loves new technologies."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://qlawmarq.github.io/" />
  <meta
    property="og:title"
    content="Profile - {$LL.name() || 'Masaki Yoshiiwa'} "
  />
  <meta
    property="og:description"
    content="GitHub Profile Page of Masaki Yoshiiwa, a software developer who loves new technologies."
  />
  <meta property="og:image" content="https://qlawmarq.github.io/icon.png" />
</svelte:head>

<section>
  <H1>
    <GlitchText text={$LL.hello()} factor={2} minMilsec={55} />
  </H1>

  {#key $locale}
    <Card>
      <H2>About</H2>
      <UnorderedList>
        <ListItem>
          Name:
          <GlitchText text={$LL.name()} factor={2} delay={100} minMilsec={45} />
        </ListItem>
        <ListItem>
          Job:
          <GlitchText text={$LL.job()} factor={0} delay={200} maxMilsec={40} />
        </ListItem>
        <ListItem>
          Bio:
          <GlitchText
            text={$LL.introduce()}
            factor={0}
            delay={300}
            maxMilsec={30}
          />
        </ListItem>
        <ListItem>
          Tech Skills:
          <Badge>TypeScript</Badge>
          <Badge>JavaScript</Badge>
          <Badge>Python</Badge>
          <Badge>React.js</Badge>
          <Badge>React Native</Badge>
          <Badge>Vue</Badge>
          <Badge>Docker</Badge>
          <Badge>K8S</Badge>
          <Badge>HTML/CSS</Badge>
          <Badge>SQL</Badge>
          <Badge>Figma</Badge>
          <Badge>CI/CD</Badge>
          <Badge>GCP</Badge>
          <Badge>AWS</Badge>
        </ListItem>
      </UnorderedList>
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
            <GlitchText text={"GitHub"} factor={8} delay={400} />
          </Anchor>
        </ListItem>
        <ListItem>
          <Anchor
            href={"https://www.linkedin.com/in/qlawmarq/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlitchText text={"LinkdIn"} factor={8} delay={600} />
          </Anchor>
        </ListItem>
        <ListItem>
          <Anchor href="mailto:masaki.yoshiiwa@gmail.com">
            <GlitchText text={"Email"} factor={8} delay={800} />
          </Anchor>
        </ListItem>
        <ListItem>
          <Anchor
            href={$LL.resumeUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlitchText text={"Resume"} factor={8} delay={1000} />
          </Anchor>
        </ListItem>
      </UnorderedList>
    </Card>
    {#if ownedRepos.length > 0}
      <Card>
        <H2>Own GitHub Projects</H2>
        <UnorderedList>
          {#each ownedRepos as repo}
            <ListItem>
              <Anchor
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {repo.name}
              </Anchor>
              <Badge>
                {repo.language || "Other"}
              </Badge>
              <Span style={"display: inline-flex;"}>
                <img src={Star} alt="Star" height="12" width="12" />
                {repo.stargazers_count}
              </Span>
              <Paragraph>
                {repo.description}
              </Paragraph>
            </ListItem>
          {/each}
        </UnorderedList>
        <Anchor
          href="https://github.com/qlawmarq?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Span>Click here to check all projects on GitHub...</Span>
        </Anchor>
      </Card>
    {/if}
    {#if starredRepos.length > 0}
      <Card>
        <H2>Recently Interested GitHub Projects</H2>
        <UnorderedList>
          {#each starredRepos as repo}
            <ListItem>
              <Anchor
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {repo.name}
              </Anchor>
              <Badge>
                {repo.language || "Other"}
              </Badge>
              <Span style={"display: inline-flex;"}>
                <img src={Star} alt="Star" height="12" width="12" />
                {repo.stargazers_count}
              </Span>
              <Paragraph>
                {repo.description}
              </Paragraph>
            </ListItem>
          {/each}
        </UnorderedList>
        <Anchor
          href="https://github.com/qlawmarq?tab=stars"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Span>
            Click here to check all recently interested projects on GitHub...
          </Span>
        </Anchor>
      </Card>
    {/if}
  {/key}
</section>

<style>
</style>

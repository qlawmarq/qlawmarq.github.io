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
  import type { GitHubRepo } from "../types/github";
  import type { RSSItem } from "../types/rss";
  import H2 from "../components/Typography/H2.svelte";
  import Badge from "../components/Badge.svelte";
  import Star from "$lib/images/star.svg";
  import Span from "../components/Typography/Span.svelte";

  let ownedRepos: GitHubRepo[] = [];
  let starredRepos: GitHubRepo[] = [];
  let rssItems: RSSItem[] = [];

  onMount(async () => {
    fetchData();
  });
  LL.subscribe(() => {
    fetchData();
  });

  async function fetchData() {
    const lang = $locale === "ja" ? "ja" : "en";
    rssItems = [];
    ownedRepos = [];
    starredRepos = [];
    try {
      const response = await fetch(`/api?lang=${lang}`);
      if (!response.ok) {
        throw new Error("Failed to fetch RSS feed");
      }
      const res = await response.json();
      rssItems = res.rss;
      ownedRepos = res.githubRepo;
      starredRepos = res.githubStaredRepo;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
</script>

<svelte:head>
  <title>Profile - {$LL.name() || "Masaki Yoshiiwa"}</title>
  <meta name="title" content="Profile - {$LL.name() || 'Masaki Yoshiiwa'} " />
  <meta
    name="description"
    content="GitHub Profile Page of Masaki Yoshiiwa, software engineer, web developer, and mobile app developer."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://qlawmarq.github.io/" />
  <meta
    property="og:title"
    content="Profile - {$LL.name() || 'Masaki Yoshiiwa'} "
  />
  <meta
    property="og:description"
    content="GitHub Profile Page of Masaki Yoshiiwa, software engineer, web developer, and mobile app developer."
  />
  <meta property="og:image" content="https://qlawmarq.github.io/icon.png" />
</svelte:head>

<section>
  <H1>
    <GlitchText text={$LL.hello()} factor={2} minMilsec={55} />
  </H1>

  {#key $locale}
    <Card>
      <H2><GlitchText text={"About"} factor={4} minMilsec={60} /></H2>
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
      <H2><GlitchText text={"Contacts"} factor={3} minMilsec={50} /></H2>
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
          <Anchor
            href={`https://qlawmarq.net/${$locale}/blog`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlitchText text={"Blog"} factor={8} delay={400} />
          </Anchor>
        </ListItem>
        <ListItem>
          <Anchor href="mailto:masaki.yoshiiwa@gmail.com">
            <GlitchText text={"Email"} factor={8} delay={800} />
          </Anchor>
        </ListItem>
      </UnorderedList>
    </Card>
    {#if rssItems.length > 0}
      <Card>
        <H2><GlitchText text="Recent Blog Posts" factor={0} /></H2>
        <UnorderedList>
          {#each rssItems as item}
            <ListItem>
              <Anchor
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GlitchText
                  text={item.title}
                  factor={0}
                  delay={200}
                  maxMilsec={30}
                />
              </Anchor>
              <Paragraph>
                {new Date(item.pubDate).toLocaleDateString()}
              </Paragraph>
            </ListItem>
          {/each}
        </UnorderedList>
      </Card>
    {/if}
    {#if ownedRepos.length > 0}
      <Card>
        <H2><GlitchText text={"Own GitHub Projects"} factor={0} /></H2>
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
                {#if repo.homepage}
                  <Span style={"display: inline-flex; margin-left: 0.5rem;"}>
                    <Anchor
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Homepage
                    </Anchor>
                  </Span>
                {/if}
              </Span>
              <Paragraph>
                <GlitchText
                  text={repo.description}
                  factor={0}
                  delay={200}
                  maxMilsec={30}
                />
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
        <H2
          ><GlitchText
            text={"Recently Interested GitHub Projects"}
            factor={0}
          /></H2
        >
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
                {#if repo.homepage}
                  <Span style={"display: inline-flex; margin-left: 0.5rem;"}>
                    <Anchor
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Homepage
                    </Anchor>
                  </Span>
                {/if}
              </Span>
              <Paragraph>
                <GlitchText
                  text={repo.description}
                  factor={0}
                  delay={200}
                  maxMilsec={30}
                />
              </Paragraph>
            </ListItem>
          {/each}
        </UnorderedList>
        <Span>
          <Anchor
            href="https://github.com/qlawmarq?tab=stars"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlitchText
              text={"Click here to check all recently interested projects on GitHub..."}
              factor={0}
              delay={200}
              maxMilsec={30}
            />
          </Anchor>
        </Span>
      </Card>
    {/if}
  {/key}
</section>

<style>
</style>

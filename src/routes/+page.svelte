<script lang="ts">
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
  import { XMLParser } from "fast-xml-parser";
  import ownedReposJSON from "../lib/json/ownedRepos.json";
  import starredReposJSON from "../lib/json/starredRepos.json";

  // Fetch own repo datas in GitHub from GitHub API
  const fetchGitHubRepos = async () => {
    let allRepos = ownedReposJSON as unknown as GitHubRepo[];
    if (process.env.NODE_ENV !== "development") {
      const url = new URL("https://api.github.com/users/qlawmarq/repos");
      let allRepos: GitHubRepo[] = [];
      url.search = new URLSearchParams({
        type: "public",
        sort: "updated",
        per_page: "50",
      }).toString();
      try {
        const res = await fetch(url);
        const json = res.json();
        allRepos = json as unknown as GitHubRepo[];
      } catch (error) {
        console.warn(error);
      }
    }
    return allRepos
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
  };

  // Fetch own repo datas in GitHub from GitHub API
  const fetchGithubStaredRepos = async () => {
    let starredRepos = starredReposJSON as unknown as GitHubRepo[];
    if (process.env.NODE_ENV !== "development") {
      const url = new URL("https://api.github.com/users/qlawmarq/starred");
      url.search = new URLSearchParams({
        per_page: "8",
      }).toString();
      try {
        const res = await fetch(url);
        const allRepos = res.json();
        starredRepos = allRepos as unknown as GitHubRepo[];
      } catch (error) {
        console.warn(error);
      }
    }
    return starredRepos;
  };

  const getRssBlogFeed = async (lang: string) => {
    const rssUrl = `https://qlawmarq.net/${lang}/blog/rss`;
    let items: RSSItem[] = [];
    try {
      const response = await fetch(rssUrl);
      const xmlData = await response.text();
      const parser = new XMLParser();
      const result = parser.parse(xmlData);
      items = result.rss.channel.item.map((item: RSSItem) => ({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
      }));
      return items;
    } catch (err) {
      console.error("Error fetching RSS feed:", err);
      return items;
    }
  };

  async function fetchData() {
    const lang = $locale === "ja" ? "ja" : "en";
    const rss = await getRssBlogFeed(lang);
    const githubRepo = await fetchGitHubRepos();
    const githubStaredRepo = await fetchGithubStaredRepos();
    return {
      rss: rss,
      githubRepo: githubRepo,
      githubStaredRepo: githubStaredRepo,
    };
  }

  async function getAndSetData() {
    ownedRepos = [];
    starredRepos = [];
    rssItems = [];
    const data = await fetchData();
    ownedRepos = data.githubRepo;
    starredRepos = data.githubStaredRepo;
    rssItems = data.rss;
  }

  let ownedRepos: GitHubRepo[] = [];
  let starredRepos: GitHubRepo[] = [];
  let rssItems: RSSItem[] = [];
  let currentLocale = "";

  LL.subscribe((l) => {
    if ($locale !== currentLocale) {
      currentLocale = $locale;
      getAndSetData();
    }
  });
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

<section role="main">
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
          Technical Skills:
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
            ariaLabel={`Check GitHub account`}
          >
            <GlitchText text={"GitHub"} factor={8} delay={400} />
          </Anchor>
        </ListItem>
        <ListItem>
          <Anchor
            href={"https://www.linkedin.com/in/qlawmarq/"}
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel={`Check LinkdIn account`}
          >
            <GlitchText text={"LinkdIn"} factor={8} delay={600} />
          </Anchor>
        </ListItem>
        <ListItem>
          <Anchor
            href={`https://qlawmarq.net/${$locale}/blog`}
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel={`Check Blog`}
          >
            <GlitchText text={"Blog"} factor={8} delay={400} />
          </Anchor>
        </ListItem>
        <ListItem>
          <Anchor href="mailto:masaki.yoshiiwa@gmail.com" ariaLabel={`Email`}>
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
                ariaLabel={item.title}
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
        <H2><GlitchText text={"My GitHub Projects"} factor={0} /></H2>
        <UnorderedList>
          {#each ownedRepos as repo}
            <ListItem>
              <Anchor
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel={repo.name}
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
                      ariaLabel={repo.homepage}
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
          ariaLabel={"View all my projects on GitHub."}
        >
          <Span>View all my projects on GitHub.</Span>
        </Anchor>
      </Card>
    {/if}
    {#if starredRepos.length > 0}
      <Card>
        <H2><GlitchText text={"Projects I'm Interested In"} factor={0} /></H2>
        <UnorderedList>
          {#each starredRepos as repo}
            <ListItem>
              <Anchor
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel={repo.name}
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
                      ariaLabel={repo.homepage}
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
            ariaLabel={"View all projects I'm interested in on GitHub."}
          >
            <GlitchText
              text={"View all projects I'm interested in on GitHub."}
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

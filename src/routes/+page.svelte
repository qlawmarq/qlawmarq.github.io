<script lang="ts">
  import Card from "../components/Card.svelte";
  import GlitchText from "../components/GlitchText.svelte";
  import LL, { locale } from "../i18n/i18n-svelte";
  import type { GitHubRepo } from "../types/github";
  import type { RSSItem } from "../types/rss";
  import Badge from "../components/Badge.svelte";
  import Star from "$lib/images/star.svg";
  import { XMLParser } from "fast-xml-parser";
  import { marked } from "marked";
  import DOMPurify from "isomorphic-dompurify";
  import ownedReposJSON from "../lib/json/ownedRepos.json";
  import starredReposJSON from "../lib/json/starredRepos.json";

  // Fetch own repo datas in GitHub from GitHub API
  const fetchGitHubRepos = async () => {
    let repos = ownedReposJSON as unknown as GitHubRepo[];
    if (process.env.NODE_ENV !== "development") {
      const params = new URLSearchParams({
        type: "public",
        sort: "updated",
        per_page: "50",
      });
      const url = `https://api.github.com/users/qlawmarq/repos?${params}`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        repos = json as unknown as GitHubRepo[];
      } catch (error) {
        console.warn(error);
      }
    }
    return repos
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

  // Fetch starred repo datas in GitHub from GitHub API
  const fetchGithubStaredRepos = async () => {
    let starredRepos = starredReposJSON as unknown as GitHubRepo[];
    if (process.env.NODE_ENV !== "development") {
      const params = new URLSearchParams({ per_page: "8" });
      const url = `https://api.github.com/users/qlawmarq/starred?${params}`;
      try {
        const res = await fetch(url);
        const allRepos = await res.json();
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

  const fetchAboutContent = async (lang: string): Promise<string | null> => {
    // Use proxy in development to avoid CORS issues
    const url = import.meta.env.DEV
      ? `/api/about/${lang}/about.md`
      : `https://storage.googleapis.com/qlawmarq.net/pages/${lang}/about.md`;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const markdown = await res.text();

      // Remove frontmatter
      const contentWithoutFrontmatter = markdown.replace(
        /^---[\s\S]*?---\n/,
        "",
      );

      // Convert to HTML and sanitize
      const rawHtml = await marked.parse(contentWithoutFrontmatter);
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);

      return sanitizedHtml;
    } catch (error) {
      console.error("Error fetching about content:", error);
      return null;
    }
  };

  async function fetchData() {
    const lang = $locale === "ja" ? "ja" : "en";
    const [rss, githubRepo, githubStaredRepo, about] = await Promise.all([
      getRssBlogFeed(lang),
      fetchGitHubRepos(),
      fetchGithubStaredRepos(),
      fetchAboutContent(lang),
    ]);
    return {
      rss,
      githubRepo,
      githubStaredRepo,
      about,
    };
  }

  async function getAndSetData() {
    ownedRepos = [];
    starredRepos = [];
    rssItems = [];
    aboutContent = null;
    const data = await fetchData();
    ownedRepos = data.githubRepo;
    starredRepos = data.githubStaredRepo;
    rssItems = data.rss;
    aboutContent = data.about;
  }

  let ownedRepos = $state<GitHubRepo[]>([]);
  let starredRepos = $state<GitHubRepo[]>([]);
  let rssItems = $state<RSSItem[]>([]);
  let aboutContent = $state<string | null>(null);
  let currentLocale = $state("");

  $effect(() => {
    if ($locale !== currentLocale) {
      currentLocale = $locale;
      void getAndSetData();
    }
  });
</script>

<svelte:head>
  <title>Profile - {$LL.name()}</title>
  <meta name="title" content="Profile - {$LL.name()}" />
  <meta
    name="description"
    content="GitHub Profile Page of Masaki Yoshiiwa, software engineer, web developer, and mobile app developer."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://qlawmarq.github.io/" />
  <meta property="og:title" content="Profile - {$LL.name()}" />
  <meta
    property="og:description"
    content="GitHub Profile Page of Masaki Yoshiiwa, software engineer, web developer, and mobile app developer."
  />
  <meta property="og:image" content="https://qlawmarq.github.io/icon.png" />
</svelte:head>

<section role="main">
  <h1>
    <GlitchText text={$LL.hello()} factor={2} minMilsec={55} />
  </h1>

  {#key $locale}
    {#if aboutContent}
      <Card>
        <div class="about-content">
          <!-- eslint-disable-next-line svelte/no-at-html-tags -- Sanitized by DOMPurify -->
          {@html aboutContent}
        </div>
      </Card>
    {/if}
    {#if rssItems.length > 0}
      <Card>
        <h2><GlitchText text={$LL.recentBlogPosts()} factor={0} /></h2>
        <ul>
          {#each rssItems as item (item.link)}
            <li>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.title}
              >
                <GlitchText
                  text={item.title}
                  factor={0}
                  delay={200}
                  maxMilsec={30}
                />
              </a>
              <p>
                {new Date(item.pubDate).toLocaleDateString()}
              </p>
            </li>
          {/each}
        </ul>
      </Card>
    {/if}
    {#if ownedRepos.length > 0}
      <Card>
        <h2><GlitchText text={$LL.myProjects()} factor={0} /></h2>
        <ul>
          {#each ownedRepos as repo (repo.id)}
            <li>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={repo.name}
              >
                {repo.name}
              </a>
              <Badge>
                {repo.language || "Other"}
              </Badge>
              <span class="text-small" style="display: inline-flex;">
                <img src={Star} alt="Star" height="12" width="12" />
                {repo.stargazers_count}
                {#if repo.homepage}
                  <span
                    class="text-small"
                    style="display: inline-flex; margin-left: 0.5rem;"
                  >
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={repo.homepage}
                    >
                      Homepage
                    </a>
                  </span>
                {/if}
              </span>
              <p>
                <GlitchText
                  text={repo.description}
                  factor={0}
                  delay={200}
                  maxMilsec={30}
                />
              </p>
            </li>
          {/each}
        </ul>
        <a
          href="https://github.com/qlawmarq?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View all my projects on GitHub."
        >
          <span class="text-small">{$LL.viewAllProjects()}</span>
        </a>
      </Card>
    {/if}
    {#if starredRepos.length > 0}
      <Card>
        <h2><GlitchText text={$LL.projects()} factor={0} /></h2>
        <ul>
          {#each starredRepos as repo (repo.id)}
            <li>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={repo.name}
              >
                {repo.name}
              </a>
              <Badge>
                {repo.language || "Other"}
              </Badge>
              <span class="text-small" style="display: inline-flex;">
                <img src={Star} alt="Star" height="12" width="12" />
                {repo.stargazers_count}
                {#if repo.homepage}
                  <span
                    class="text-small"
                    style="display: inline-flex; margin-left: 0.5rem;"
                  >
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={repo.homepage}
                    >
                      Homepage
                    </a>
                  </span>
                {/if}
              </span>
              <p>
                <GlitchText
                  text={repo.description || "No description"}
                  factor={0}
                  delay={200}
                  maxMilsec={30}
                />
              </p>
            </li>
          {/each}
        </ul>
        <span class="text-small">
          <a
            href="https://github.com/qlawmarq?tab=stars"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={$LL.viewAllProjects()}
          >
            <GlitchText
              text={$LL.viewAllProjects()}
              factor={0}
              delay={200}
              maxMilsec={30}
            />
          </a>
        </span>
      </Card>
    {/if}
  {/key}
</section>

<style>
</style>

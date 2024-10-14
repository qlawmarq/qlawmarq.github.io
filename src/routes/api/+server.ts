import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { XMLParser } from "fast-xml-parser";
import ownedReposJSON from "../../lib/json/ownedRepos.json";
import starredReposJSON from "../../lib/json/starredRepos.json";
import type { GitHubRepo } from "../../types/github";
import type { RSSItem } from "../../types/rss";

const loadRepos = () => {
  const ownedRepos: GitHubRepo[] = ownedReposJSON
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
    }) as unknown as GitHubRepo[];
  const starredRepos: GitHubRepo[] =
    starredReposJSON as unknown as GitHubRepo[];
  return {
    ownedRepos,
    starredRepos,
  };
};

// Fetch own repo datas in GitHub from GitHub API
const fetchGitHubRepos = async () => {
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
    allRepos = ownedReposJSON as unknown as GitHubRepo[];
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
  const url = new URL("https://api.github.com/users/qlawmarq/starred");
  let starredRepos = [];
  url.search = new URLSearchParams({
    per_page: "8",
  }).toString();
  try {
    const res = await fetch(url);
    const allRepos = res.json();
    starredRepos = allRepos as unknown as GitHubRepo[];
  } catch (error) {
    starredRepos = starredReposJSON as unknown as GitHubRepo[];
  }
  return starredRepos;
};

const getRssBlogFeed = async (lang: string) => {
  const rssUrl = `http://qlawmarq.net/${lang}/blog/rss`;
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

export const GET: RequestHandler = async ({ url }) => {
  const lang = url.searchParams.get("lang") || "en";
  console.log(process.env.NODE_ENV, lang, url);
  const rss = await getRssBlogFeed(lang);
  let githubRepo: GitHubRepo[] = [];
  let githubStaredRepo: GitHubRepo[] = [];
  if (process.env.NODE_ENV === "development") {
    const mock = loadRepos();
    githubRepo = mock.ownedRepos;
    githubStaredRepo = mock.starredRepos;
  } else {
    githubRepo = await fetchGitHubRepos();
    githubStaredRepo = await fetchGithubStaredRepos();
  }
  return json({
    rss: rss,
    githubRepo: githubRepo,
    githubStaredRepo: githubStaredRepo,
  });
};

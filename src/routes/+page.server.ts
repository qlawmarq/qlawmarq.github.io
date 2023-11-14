import { writeJsonFileToPath } from "$lib/json";
import ky from "ky";
import type { GitHubRepo } from "../types/github";

export async function load() {
  if (process.env.NODE_ENV === "development") {
    const allRepos = await ky
      .get("https://api.github.com/users/qlawmarq/repos", {
        searchParams: new URLSearchParams({
          type: "public",
          sort: "updated",
          per_page: "50",
        }),
      })
      .json<GitHubRepo[]>();
    const filteredAllRepos = allRepos
      
    const starredRepos: GitHubRepo[] = await ky
      .get("https://api.github.com/users/qlawmarq/starred", {
        searchParams: new URLSearchParams({
          per_page: "8",
        }),
      })
      .json();
    writeJsonFileToPath(filteredAllRepos, "src/lib/json/ownedRepos.json");
    writeJsonFileToPath(starredRepos, "src/lib/json/starredRepos.json");
  }
}

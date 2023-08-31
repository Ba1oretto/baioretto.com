// noinspection JSUnusedGlobalSymbols,ES6ConvertVarToLetConst

import { Octokit } from "@octokit/rest";
import { GITHUB_TOKEN } from "~/util/variable.server";

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export type LanguageDict = { [index: string]: number };

declare global {
  var __authed_user__: string;
  var __repositories__: string[] | null;
  var __repo_language__: { [index: string]: LanguageDict };
  var __top_languages__: [ string, number ][];
  var __cleaner__: NodeJS.Timeout;
}

if (!global.__cleaner__) {
  global.__repo_language__ = {};
  global.__top_languages__ = [];

  global.__cleaner__ = setInterval(() => {
    console.info("clean up global variable...");
    global.__repositories__ = null;
    global.__repo_language__ = {};
    global.__top_languages__ = [];
  }, 7200000);
}

namespace Internal {
  export async function getRepositories() {
    return octokit.request("GET /user/repos", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      affiliation: "owner",
    });
  }

  export async function getAuthedUser() {
    const { data } = await octokit.users.getAuthenticated();

    // using global variable so that getAuthenticated() will only be executed once.
    const username = data.name;

    if (!username) {
      throw new Error("octokit.users.getAuthenticated() return a null username");
    }

    return username;
  }

  export async function getRepoLanguage(user: string, repo: string) {
    return octokit.request("GET /repos/{owner}/{repo}/languages", {
      owner: user,
      repo: repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  }
}

async function getRepositories(): Promise<string[]> {
  if (!global.__repositories__) {
    global.__repositories__ = (await Internal.getRepositories()).data.map(repo => repo.name);
  }
  return global.__repositories__;
}

async function getAuthedUser(): Promise<string> {
  if (!global.__authed_user__) {
    global.__authed_user__ = await Internal.getAuthedUser();
  }
  return global.__authed_user__;
}

async function getRepoLanguage(user: string, repo: string) {
  if (!global.__repo_language__[repo]) {
    global.__repo_language__[repo] = (await Internal.getRepoLanguage(user, repo)).data as LanguageDict;
  }
  return global.__repo_language__[repo];
}

async function getTopLanguages(): Promise<[ string, number ][]> {
  if (global.__top_languages__.length) {
    return global.__top_languages__;
  }

  const repositories = await getRepositories();
  const user = await getAuthedUser();

  const languages: LanguageDict = {};
  for (const repo of repositories) {
    const language_dict = await getRepoLanguage(user, repo);
    for (const language of Object.keys(language_dict)) {
      languages[language] = language_dict[language] + (languages[language] ? languages[language] : 0);
    }
  }

  const top_languages = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const count = top_languages.reduce(([ _0, previous ], [ _1, current ]) => [ "", previous + current ])[1];
  return global.__top_languages__ = top_languages.map(([ language, amount ]) => [ language, Math.round(amount / count * 100) ]);
}

export {
  getAuthedUser,
  getTopLanguages,
};
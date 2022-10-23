const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const username = 'ejfox';

all_commits = [];

const octokit = new Octokit({
  auth: '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',
  userAgent: 'ejfox-commits-downloader',
  baseUrl: 'https://api.github.com',
  timeZone: 'America/New_York',
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error,
  },
  request: {
    agent: undefined,
    fetch: undefined,
    timeout: 0,
  },
});

(async () => {
  console.log('Fetching commits... for ' + username);
  // const { data } = await octokit.repos.listForUser({
  //   username,
  //   type: 'owner',
  // });
  // const repos = data.map((repo) => repo.name);

  octokit
    .paginate(octokit.repos.listForUser, {
      username,
    })
    .then((userRepos) => {
      console.log('Found ' + userRepos.length + ' repos');
      for (const repo of userRepos) {
        console.log('Fetching commits... for ' + repo.name);
        octokit
          .paginate(octokit.repos.listCommits, {
            owner: username,
            repo: repo.name,
          })
          .then((commits) => {
            for (const commit of commits) {
              all_commits.push(commit);
            }

            console.log('Found ' + all_commits.length + ' commits');

            // write all_commits to file
            fs.writeFileSync(
              './public/data/commits_all.json',
              JSON.stringify(all_commits, null, 2)
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
})();

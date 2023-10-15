const fs = require('fs');
// instead of axios, load all of the files with fs.readFileSync
let arenaBlocks = JSON.parse(
  fs.readFileSync('./public/data/arena_blocks_all.json', 'utf8')
);

// ARENA BLOCKS LOOK LIKE THIS:
//
// {
//   "id": 4331106,
//   "title": "05a7b336-fb64-4c97-9ed2-8a5e1fc54bfa.jpg",
//   "updated_at": "2019-05-25T04:35:29.017Z",
//   "created_at": "2019-05-24T12:52:01.823Z",
//   "state": "available",
//   "comment_count": 0,
//   "generated_title": "05a7b336-fb64-4c97-9ed2-8a5e1fc54bfa.jpg",
//   "content_html": "",
//   "description_html": "<p>Hand-sewn zine, 1 of 1</p>",
//   "visibility": "public",
//   "content": "",
//   "description": "Hand-sewn zine, 1 of 1",
//   "source": null,
//   "image": {
//     "filename": "4401dbdc7b5bfcc8cf7a6b7ec576dd65.jpg",
//     "content_type": "image/jpeg",
//     "updated_at": "2019-05-24T12:52:05.297Z",
//     "thumb": {
//       "url": "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI0MzMxMTA2L29yaWdpbmFsXzQ0MDFkYmRjN2I1YmZjYzhjZjdhNmI3ZWM1NzZkZDY1LmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6NDAwLCJoZWlnaHQiOjQwMCwiZml0IjoiaW5zaWRlIiwid2l0aG91dEVubGFyZ2VtZW50Ijp0cnVlfSwid2VicCI6eyJxdWFsaXR5Ijo5MH0sImpwZWciOnsicXVhbGl0eSI6OTB9LCJyb3RhdGUiOm51bGx9fQ==?bc=1"
//     },
//     "square": {
//       "url": "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI0MzMxMTA2L29yaWdpbmFsXzQ0MDFkYmRjN2I1YmZjYzhjZjdhNmI3ZWM1NzZkZDY1LmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6NDQwLCJoZWlnaHQiOjQ0MCwiZml0IjoiY292ZXIiLCJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWV9LCJ3ZWJwIjp7InF1YWxpdHkiOjkwfSwianBlZyI6eyJxdWFsaXR5Ijo5MH0sInJvdGF0ZSI6bnVsbH19?bc=1"
//     },
//     "display": {
//       "url": "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI0MzMxMTA2L29yaWdpbmFsXzQ0MDFkYmRjN2I1YmZjYzhjZjdhNmI3ZWM1NzZkZDY1LmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTIwMCwiaGVpZ2h0IjoxMjAwLCJmaXQiOiJpbnNpZGUiLCJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWV9LCJ3ZWJwIjp7InF1YWxpdHkiOjkwfSwianBlZyI6eyJxdWFsaXR5Ijo5MH0sInJvdGF0ZSI6bnVsbH19?bc=1"
//     },
//     "large": {
//       "url": "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI0MzMxMTA2L29yaWdpbmFsXzQ0MDFkYmRjN2I1YmZjYzhjZjdhNmI3ZWM1NzZkZDY1LmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTgwMCwiaGVpZ2h0IjoxODAwLCJmaXQiOiJpbnNpZGUiLCJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWV9LCJ3ZWJwIjp7InF1YWxpdHkiOjkwfSwianBlZyI6eyJxdWFsaXR5Ijo5MH0sInJvdGF0ZSI6bnVsbH19?bc=1"
//     },
//     "original": {
//       "url": "https://d2w9rnfcy7mm78.cloudfront.net/4331106/original_4401dbdc7b5bfcc8cf7a6b7ec576dd65.jpg?1558702325?bc=1",
//       "file_size": 6413525,
//       "file_size_display": "6.12 MB"
//     }
//   },
//   "embed": null,
//   "attachment": null,
//   "metadata": null,
//   "base_class": "Block",
//   "class": "Image",
//   "user": {
//     "id": 22564,
//     "created_at": "2017-11-09T21:21:21.353Z",
//     "slug": "ej-fox",
//     "username": "EJ Fox",
//     "first_name": "EJ",
//     "last_name": "Fox",
//     "full_name": "EJ Fox",
//     "avatar": "https://gravatar.com/avatar/4a503ee102c67cc632d77f97721d83f7.png?d=blank&r=r&s=150",
//     "avatar_image": {
//       "thumb": "https://gravatar.com/avatar/4a503ee102c67cc632d77f97721d83f7.png?d=blank&r=r&s=40",
//       "display": "https://gravatar.com/avatar/4a503ee102c67cc632d77f97721d83f7.png?d=blank&r=r&s=150"
//     },
//     "channel_count": 113,
//     "following_count": 54,
//     "profile_id": 107323,
//     "follower_count": 15,
//     "initials": "EF",
//     "can_index": true,
//     "metadata": {
//       "description": null
//     },
//     "is_premium": true,
//     "is_lifetime_premium": false,
//     "is_supporter": false,
//     "is_exceeding_connections_limit": false,
//     "is_confirmed": true,
//     "is_pending_reconfirmation": false,
//     "is_pending_confirmation": false,
//     "badge": "premium",
//     "base_class": "User",
//     "class": "User"
//   },
//   "position": 1,
//   "selected": false,
//   "connection_id": 6365220,
//   "connected_at": "2019-05-24T12:52:01.984Z",
//   "connected_by_user_id": 22564,
//   "connected_by_username": "EJ Fox",
//   "connected_by_user_slug": "ej-fox"
// },

let pinboardBookmarks = JSON.parse(
  fs.readFileSync('./public/data/pinboard_bookmarks_all.json', 'utf8')
);

// BOOKMARKS LOOK LIKE THIS
//
// {
//   "href": "https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi%3A10.7910/DVN/II2DB6",
//   "description": "Cumulative CCES Common Content (2006-2018) - CCES Dataverse",
//   "extended": "",
//   "meta": "b3366225dab473115c8bce6415d76b1a",
//   "hash": "2c842cf7380759715168b03244b0bb5f",
//   "time": "2020-06-24T01:20:54Z",
//   "shared": "yes",
//   "toread": "no",
//   "tags": ""
// },

let tweets = JSON.parse(
  // fs.readFileSync('./public/data/all_tweets_tagged.json', 'utf8')
  fs.readFileSync('./public/data/tweets_all.json', 'utf8')

);

// TWEETS LOOK LIKE THIS
//
// {
//   "attachments": { "media_keys": ["3_1535982799043416073"] },
//   "id": "1535982805133426694",
//   "lang": "en",
//   "created_at": "2022-06-12T13:50:12.000Z",
//   "public_metrics": {
//     "retweet_count": 0,
//     "reply_count": 1,
//     "like_count": 5,
//     "quote_count": 0
//   },
//   "text": "In pottery they have these rulers that help create pieces at a desired size, despite the clay shrinking when fired in the kiln, so on these rulers, they no longer measure our current reality, but instead measure a reality we have not created yet, these tools alter time &amp; space ",
//   "mediaUrls": [
//     {
//       "media_key": "3_1535982799043416073",
//       "type": "photo",
//       "url": "https://pbs.twimg.com/media/FVDoN74X0AkFXtL.jpg"
//     }
//   ],
//   "gpt3Tags": ["pottery", "rulers", "clay", "kiln"]
// },

let commits = JSON.parse(
  fs.readFileSync('./public/data/commits_all.json', 'utf8')
);

// COMMITS LOOK LIKE THIS
//
//   {
//   "sha": "671c7ac7b8c1a1c00406c4bea508e530da541b95",
//   "node_id": "MDY6Q29tbWl0NzM5OTAzMTE6NjcxYzdhYzdiOGMxYTFjMDA0MDZjNGJlYTUwOGU1MzBkYTU0MWI5NQ==",
//   "commit": {
//     "author": {
//       "name": "EJ Fox",
//       "email": "ejfox@ejfox.com",
//       "date": "2017-08-20T17:34:21Z"
//     },
//     "committer": {
//       "name": "EJ Fox",
//       "email": "ejfox@ejfox.com",
//       "date": "2017-08-20T17:34:21Z"
//     },
//     "message": "tighten up keywords, add Trump",
//     "tree": {
//       "sha": "5abd8bdf6c8dd6b01b7ab0dc59baf3cc61686ae6",
//       "url": "https://api.github.com/repos/ejfox/close2home/git/trees/5abd8bdf6c8dd6b01b7ab0dc59baf3cc61686ae6"
//     },
//     "url": "https://api.github.com/repos/ejfox/close2home/git/commits/671c7ac7b8c1a1c00406c4bea508e530da541b95",
//     "comment_count": 0,
//     "verification": {
//       "verified": false,
//       "reason": "unsigned",
//       "signature": null,
//       "payload": null
//     }
//   },
//   "url": "https://api.github.com/repos/ejfox/close2home/commits/671c7ac7b8c1a1c00406c4bea508e530da541b95",
//   "html_url": "https://github.com/ejfox/close2home/commit/671c7ac7b8c1a1c00406c4bea508e530da541b95",
//   "comments_url": "https://api.github.com/repos/ejfox/close2home/commits/671c7ac7b8c1a1c00406c4bea508e530da541b95/comments",
//   "author": {
//     "login": "ejfox",
//     "id": 530073,
//     "node_id": "MDQ6VXNlcjUzMDA3Mw==",
//     "avatar_url": "https://avatars.githubusercontent.com/u/530073?v=4",
//     "gravatar_id": "",
//     "url": "https://api.github.com/users/ejfox",
//     "html_url": "https://github.com/ejfox",
//     "followers_url": "https://api.github.com/users/ejfox/followers",
//     "following_url": "https://api.github.com/users/ejfox/following{/other_user}",
//     "gists_url": "https://api.github.com/users/ejfox/gists{/gist_id}",
//     "starred_url": "https://api.github.com/users/ejfox/starred{/owner}{/repo}",
//     "subscriptions_url": "https://api.github.com/users/ejfox/subscriptions",
//     "organizations_url": "https://api.github.com/users/ejfox/orgs",
//     "repos_url": "https://api.github.com/users/ejfox/repos",
//     "events_url": "https://api.github.com/users/ejfox/events{/privacy}",
//     "received_events_url": "https://api.github.com/users/ejfox/received_events",
//     "type": "User",
//     "site_admin": false
//   },
//   "committer": {
//     "login": "ejfox",
//     "id": 530073,
//     "node_id": "MDQ6VXNlcjUzMDA3Mw==",
//     "avatar_url": "https://avatars.githubusercontent.com/u/530073?v=4",
//     "gravatar_id": "",
//     "url": "https://api.github.com/users/ejfox",
//     "html_url": "https://github.com/ejfox",
//     "followers_url": "https://api.github.com/users/ejfox/followers",
//     "following_url": "https://api.github.com/users/ejfox/following{/other_user}",
//     "gists_url": "https://api.github.com/users/ejfox/gists{/gist_id}",
//     "starred_url": "https://api.github.com/users/ejfox/starred{/owner}{/repo}",
//     "subscriptions_url": "https://api.github.com/users/ejfox/subscriptions",
//     "organizations_url": "https://api.github.com/users/ejfox/orgs",
//     "repos_url": "https://api.github.com/users/ejfox/repos",
//     "events_url": "https://api.github.com/users/ejfox/events{/privacy}",
//     "received_events_url": "https://api.github.com/users/ejfox/received_events",
//     "type": "User",
//     "site_admin": false
//   },
//   "parents": [
//     {
//       "sha": "4211f55a706e9d730c414cf00accbc3ed53699fb",
//       "url": "https://api.github.com/repos/ejfox/close2home/commits/4211f55a706e9d730c414cf00accbc3ed53699fb",
//       "html_url": "https://github.com/ejfox/close2home/commit/4211f55a706e9d730c414cf00accbc3ed53699fb"
//     }
//   ]
// },

// first add the type to each data type loaded
arenaBlocks = arenaBlocks.map((d) => {
  d.type = 'arena';
  return d;
});

pinboardBookmarks = pinboardBookmarks.map((d) => {
  d.type = 'pinboard';
  // parse out the tags
  d.tags = d.tags.split(' ').map((d) => {
    return d.trim();
  });
  return d;
});

tweets = tweets.map((d) => {
  d.type = 'tweet';
  d.tags = d?.gpt3Tags;
  return d;
});

commits = commits.map((d) => {
  d.type = 'commit';
  return d;
});

const filteredTweets = tweets
  // remove tweets with no text
  .filter((t) => {
    if (!t.text) return false;
    return t.text.length > 0;
  })
  // Filter tweets by number of likes
  // .filter((t) => {
  //   if(!t.public_metrics) return
  //   return t.public_metrics.like_count > 1;
  // })
  // remove all t.co links from the text
  .map((t) => {
    if (!t.text) return t;
    return {
      ...t,
      text: t.text.replace(/\b(https?:\/\/)?t.co\/\w+\b/g, ''),
    };
  })
  // remove all pic.twitter.com links from the text
  .map((t) => {
    if (!t.text) return t;
    return {
      ...t,
      text: t.text.replace(/\b(https?:\/\/)?pic.twitter.com\/\w+\b/g, ''),
    };
  });
// remove any tweets with @ in the text
// .filter((t) => {
//   return !t.text.includes('@');
// })

const filteredBookmarks = pinboardBookmarks.filter((b) => {
  return b.tags.length > 1;
});

const filteredCommits = commits
  .map((c) => {
    const time = new Date(c.commit.committer.date);
    return {
      ...c,
    };
  })
  // filter out any commits where the committer.login is not ejfox
  .filter((c) => {
    return c.commit.committer.login === 'ejfox';
  });

const filteredArenaBlocks = arenaBlocks.map((b) => {
  return {
    ...b,
  };
});

// combine all into one array
// let allData = [...arenaBlocks, ...pinboardBookmarks, ...tweets, ...commits];
let allData = [
  ...filteredArenaBlocks,
  ...filteredBookmarks,
  ...filteredTweets,
  ...filteredCommits,
];

console.log(
  'Random item:',
  allData[Math.floor(Math.random() * allData.length)]
);

// first we need to make sure everything has a root-level timestamp
let data = allData.map((item) => {
  // Get the date for the right spot for each tweet type
  if (item.type === 'arena') {
    item.timestamp = item.created_at;
  }

  if (item.type === 'pinboard') {
    item.timestamp = item.time;
    console.log(item.tags);
  }

  if (item.type === 'tweet') {
    item.timestamp = item.created_at;
  }

  if (item.type === 'commit') {
    item.timestamp = item.commit.author.date;
  }

  item.parsedTime = new Date(item.timestamp);

  // create a unique ID for each item based on its time
  item.id = item.parsedTime.getTime();

  // if item.tags has a single item with 'none', remove it
  if (item.tags) {
    if (item.tags.length === 1 && item.tags[0] === 'none') {
      item.tags = [];
    }
  }

  return item;
});
// sort the data by timestamp
data = data.sort((a, b) => {
  return a.parsedTime - b.parsedTime;
});

console.log('With everything combined:', data.length + ' items');

// show a random item from the combined data
console.log('Random item:', data[Math.floor(Math.random() * allData.length)]);

// Make a list of all the unique tags that appear across all items in the data
let allTags = [];
data.forEach((item) => {
  if (!item.tags) return;
  if (item.type === 'pinboard') {
    item.tags.forEach((tag) => {
      if (allTags.indexOf(tag) === -1) {
        allTags.push(tag);
      }
    });
  } else if (item.type === 'tweet') {
    console.log(item.tags)
    if (!item.tags) return false
    if (item.tags === 'none') return false
    if (item.tags.length < 1 ) return false
    item.tags.forEach((tag) => {
      if (allTags.indexOf(tag) === -1) {
        allTags.push(tag);
      }
    });
  }
});

// create a new map with all of the tags and the IDs of every item that has that tag
let tagMap = {};
allTags.forEach((tag) => {
  tagMap[tag] = [];
});
data.forEach((item) => {
  if (!item.tags) return;
  if (item.type === 'pinboard') {
    item.tags.forEach((tag) => {
      tagMap[tag].push(item.id);
    });
  } else if (item.type === 'tweet') {
    if(item.tags === 'none') return false
    item.tags.forEach((tag) => {
      tagMap[tag].push(item.id);
    });
  }
});

// sort tagMap by length
// const sortedTagMap = Object.keys(tagMap).sort((a, b) => {
//   return tagMap[b].length - tagMap[a].length;
// })



// write the unique tags and their counts to a json file
fs.writeFileSync('./public/data/tagMap.json', JSON.stringify(tagMap, null, 2));

// write allData to a json file
// fs.writeFileSync('./public/data/allData.json', JSON.stringify(allData));
// write a sliced version to a json file (first 2000)
fs.writeFileSync(
  './public/data/allData.json',
  JSON.stringify(allData)
);

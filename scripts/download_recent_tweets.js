const fs = require('fs');
const axios = require('axios');
const apiKey = 'PBDpC3kbIYMD9vEeARXhIY8Cf';
const apiKeySecret = '9jsNXncLWeUnDpjxdETHHkAxeLzBhLhUzAIOTtD2dirkQo6Mu2';
const bearerToken =
  'AAAAAAAAAAAAAAAAAAAAAAw7eAEAAAAA%2By%2F4vh%2F5%2BbVWENbv72kFrqzrrio%3Db439vjiE4wO2OnYdqOv3FHHMlui0GKESxyw29pKicrQVihM5Jw';

// go through all tweets and add tags using openAI
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

const $mrejfox = '10449';

const { TwitterApi, TwitterV2IncludesHelper } = require('twitter-api-v2');

// OAuth 1.0a (User context)
const userClient = new TwitterApi({
  appKey: apiKey,
  appSecret: apiKeySecret,
  // Following access tokens are not required if you are
  // at part 1 of user-auth process (ask for a request token)
  // or if you want a app-only client (see below)
  // accessToken: 'accessOAuthToken',
  // accessSecret: 'accessOAuthSecret',
});

async function getUserTimeline(userId) {
  // OAuth2 (app-only or user context)
  // Create a client with an already known bearer token
  const appOnlyClient = new TwitterApi(bearerToken);

  const userTimeline = await appOnlyClient.v2.userTimeline($mrejfox, {
    'tweet.fields': ['created_at', 'public_metrics', 'lang'],
    expansions: ['attachments.media_keys', 'referenced_tweets.id'],
    'media.fields': ['url', 'preview_image_url']
  });
  const includes = new TwitterV2IncludesHelper(userTimeline);

  const allTweets = [];
  for await (const fetchedTweet of userTimeline) {
    fetchedTweet.mediaUrls = userTimeline.includes.medias(fetchedTweet);

    // for await (const media of fetchedTweet.mediaUrls) {
    //   if(!media.url) return
    //   await download_image(media.url, './public/images/'+media.media_key+'.jpg')
    // }

    // Now if we were cool, we would download all of the mediaUrls into a folder of images with the filenames as the media_key with axios
    allTweets.push(fetchedTweet);
  }


  // write allTweets to file
  fs.writeFileSync(
    './public/data/tweets_all.json',
    JSON.stringify(allTweets, null, 2)
  );
}

getUserTimeline($mrejfox);

//https://stackoverflow.com/questions/12740659/downloading-images-with-node-js

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', (e) => reject(e));
      })
  );

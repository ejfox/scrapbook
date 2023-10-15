const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const { RateLimiter } = require('limiter');

const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'minute',
  fireImmediately: true,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// make async function
async function add_tags_to_tweets() {
  // load tweets from public/data/tweets_all.json
  const tweets = JSON.parse(
    fs.readFileSync('./public/data/tweets_all.json', 'utf8')
  );

  const filteredTweets = tweets
    .filter((t) => {
      return t.public_metrics.like_count > 1;
    })
    // remove all t.co links
    .map((t) => {
      return {
        ...t,
        text: t.text.replace(/\b(https?:\/\/)?t.co\/\w+\b/g, ''),
      };
    })
    // remove all pic.twitter.com links
    .map((t) => {
      return {
        ...t,
        text: t.text.replace(/\b(https?:\/\/)?pic.twitter.com\/\w+\b/g, ''),
      };
    })
    // remove any tweets with @ in the text
    // .filter((t) => {
    //   return !t.text.includes('@');
    // })
    // remove tweets with no text
    .filter((t) => {
      return t.text.length > 0;
    });

  console.log(tweets.length + ' tweets loaded');

  const taggedTweets = [];

  // Use openAI to tag the tweets
  const tagTweetRequests = filteredTweets.map(async (tweet, i) => {
    tweet.gpt3Tags = await tagTweet(tweet.text);
    console.log('🏷️ tags', tweet.text, tweet.gpt3Tags);
    taggedTweets.push(tweet);
    return tweet;
  });

  async function tagTweet(tweetText) {
    const remaining = await limiter.removeTokens(1);
    const prompt = `EJ is writing a tool that takes a tweet and applies a tag to it. EJ uses these tags to categorize tweets:  '3d', 'activism', 'arduino', 'art', 'cli', 'cooking', 'crypto', 'd3', 'data', 'datajournalism', 'dataset', 'dataviz', 'design', 'elections', 'Fashion', 'food', 'games', 'github', 'hackers', 'hacking', 'howto', 'inspiration', 'javascript', 'journalism', 'machinelearning', 'mapping', 'maps', 'music', 'node', 'oakland', 'occupy', 'photography', 'pico8', 'police', 'politics', 'programming', 'protest', 'raspberrypi', 'recipe', 'reference', 'research', 'resource', 'tech', 'tool', 'video', 'visualization', 'vj', 'webdesign', 'writing', and 'youtube'. If none of these words describe the tweet, we just use the word \"none\". \n\n\n---\ntweet: \"now we’re talkin\"\ntags: 'none'\n---\ntweet: \"I want to break news on our Twitch stream this year\"\ntags: 'journalism', 'streaming', 'twitch', 'news'\n---\ntweet: \"Something cool about taking a map from 1954 and running it through a 3D graphics engine (via USGS's awesome Topoview tool which lets you get geoTIFFs going back to 1880)\"\ntags: 'mapping', '3d'\n---\ntweet: \"Going live now\"\ntags: 'live', 'video'\n---\ntweet:${tweetText}`;
    if (tweetText.length > 5) {
      const response = await openai.createCompletion({
        model: 'text-davinci-002',
        // prompt: tweet.text,
        prompt,
        temperature: 0.2,
        max_tokens: 120,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      let tags = response.data.choices[0].text.split('\ntags: ')[1].split(', ');

      tags = tags.map((tag) => {
        // remove any quote marks from the tag
        return tag.replace(/['"]+/g, '');
      });

      return tags;
    } else {
      return 'none';
    }
  }

  // wait for all requests to be done and then write to file
  await Promise.all(tagTweetRequests);
  console.log('💡 All tweets tagged');
  console.log('💡 Writing tagged tweets to file');
  fs.writeFileSync(
    './public/data/all_tweets_tagged.json',
    JSON.stringify(taggedTweets)
  );
  console.log(`💾 ${taggedTweets.length} tweets tagged and saved to file`);
}

add_tags_to_tweets();

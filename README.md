# Personal Scrapbook

The goal of this project is to allow myself a mechanism to look through all of the things I collect online; bookmarks, images, small text posts and begin the process of organizing them into themes, ideas, and projects. 

## Weekly increments
A lot of the tooling is based around the idea of weekly increments. I want to be able to look back at a week and see what I was thinking about, what I was reading, and what I was working on – often this is a unit that collects around a theme or idea, even if some projects or ideas span months or years. 

## Sources
- Pinboard
- Are.na
- Twitter (Deprecated)

### Are.na
<scripts/download_arena_channels.js> is a script that will download all of the channels from my Are.na account and save them as JSON files in the `public/data` directory

- <public/data/arena_channels.json>
- <public/data/arena_blocks_all.json>

### Pinboard
<scripts/download_pinboard_bookmarks.js> is a script that will download all of the bookmarks from my Pinboard account and save them as JSON files in the `public/data` directory
- <public/data/pinboard_bookmarks_all.json>

### Twitter (Deprecated)
<scripts/download_recent_tweets.js> used to download all of my recent tweets and save them as JSON files in the `public/data` directory. Who cares anymore.


### Future Sources
- TODO: Mastodon 
- TODO: Goodreads
- TODO: Kindle Highlights
- TODO: GitHub

### Source Combination
<scripts/combine_EVERYTHING.js> is a script that will combine all of the data from the sources above into a single JSON file that can be used by the application.


## Features

### Bookmark Physics
Recreating a physical table full of different things I want to arrange by moving them around.

### Automated tagging
Using a combination of machine learning and a dictionary of tags to automatically tag content that is imported.

## Development Setup

Make sure to install the dependencies:

```bash
yarn install
```

## Development Server

Start the development server on http://localhost:3000

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.

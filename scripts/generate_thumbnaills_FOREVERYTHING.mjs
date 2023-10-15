// const fs = require('fs');
// const puppeteer = require('puppeteer');

// import fetch, fs, puppeteer
import fetch from 'node-fetch';
import fs from 'fs';
import puppeteer from 'puppeteer';


// we are going to load the list of everything combined from public/data/allData.json

// then we are going to loop through each item and generate a thumbnail for it
// if the thumbnail doesn't exist
// if the item has a URL, we will use puppeteer to generate a thumbnail
// if the item is a tweet, we will generate our own image using the text
// then we will save the thumbnail to public/thumbnails


// const fetch = require('node-fetch');
// const { createCanvas, loadImage } = require('canvas');

// load the list of everything (pinboard bookmarks, tweets, arena blocks, etc)
// const allData = require('../public/data/allData.json');
// import allData from '../public/data/allData.json';
// "Unknown file extension ".json" for /Users/ejfox/code/pre-2022/scrapbook/public/data/allData.json"
// so we will use fs.readFileSync
const allData = JSON.parse(fs.readFileSync('./public/data/allData.json'));

// loop through each item
allData.forEach(async (item) => {
  console.log(item);
  // first we need to check if the thumbnail exists
  // if it does, we don't need to do anything
  // if it doesn't, we need to generate it
  // we can check if the thumbnail exists by checking if the file exists
  // we can check if the file exists by using fs.existsSync
  const thumbnailPath = `../public/thumbnails/${item.id}.png`;
  if (fs.existsSync(thumbnailPath)) {
    // if the thumbnail exists, we don't need to do anything
    console.log(`thumbnail exists for ${item.id}`);
    return;
  }

  // if the item has a .mediaUrls array
  // we will grab the first item from that and download from the .url
  // we will save the image to the thumbnailPath
  if (item.mediaUrls) {
    if(item.mediaUrls.length === 0) return 
    // if the item has a .mediaUrls array
    const mediaUrl = item.mediaUrls[0];
    // we will grab the first item from that and download from the .url
    // make sure mediaUrl is a valid URL before we try to fetch it
    if (!mediaUrl) {
      console.log(`no mediaUrl for ${item.id}`);
      return;
    }
    
    // make sure it can be parsed by URL
    let url;
    try {
      url = new URL(mediaUrl);
    } catch (error) {
      console.log(`invalid mediaUrl for ${item.id}`);
      return;
    }

    const response = await fetch(mediaUrl);
    // const buffer = await response.buffer();
    // use arrayBuffer instead
    const buffer = await response.arrayBuffer();
    
    // we will save the image to the thumbnailPath
    // we need to use fs.writeFileSync
    fs.writeFileSync(thumbnailPath, buffer);
    // we need to log that we generated a thumbnail
    console.log(`downloaded thumbnail for ${item.id}`);
    return;
  }


  if (item.url) {
    // if the item has a URL, we will use puppeteer to generate a thumbnail
    // we need to launch puppeteer
    const browser = await puppeteer.launch();
    // we need to create a new page
    const page = await browser.newPage();
    // we need to set the viewport size
    await page.setViewport({
      width: 1200,
      height: 630,
    });

    // we need to go to the URL
    await page.goto(item.url);

    // we need to take a screenshot
    await page.screenshot({
      path: thumbnailPath,
    });

    // we need to close the browser
    await browser.close();

    // we need to log that we generated a thumbnail
    console.log(`generated thumbnail for ${item.id}`);
  }
});

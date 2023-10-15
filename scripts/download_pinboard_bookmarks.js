const fs = require('fs').promises;
const moment = require('moment');
const axios = require('axios');
require('dotenv').config();

const WAIT_BETWEEN_REQUESTS = 2500; // ms

const pinboardAPI = 'https://api.pinboard.in/v1';
const api_token = process.env.PINBOARD_API_TOKEN;

async function gatherBookmarksForWeek(fromDate, toDate) {
  const fromDateString = moment(fromDate).format('YYYY-MM-DDTHH:mm:ss') + "Z";
  const toDateString = moment(toDate).format('YYYY-MM-DDTHH:mm:ss') + "Z";
  console.log('Scraping from ' + fromDateString + ' to ' + toDateString);
  const filePath = `./public/data/pinboard_bookmarks/${fromDateString}_${toDateString}.json`;

  try {
    await fs.access(filePath);
    console.log('File already exists');
    return;
  } catch (error) {
    try {
      // Make a GET request to the Pinboard API
      const queryUrl = `${pinboardAPI}/posts/all?auth_token=${api_token}&fromdt=${fromDateString}&todt=${toDateString}&format=json`;
      console.log('Making API request...', queryUrl);
      const res = await axios.get(queryUrl);
      console.log('Returned from API ☑️');

      // clean up the filepath to be a better file path (no weird characters)
      const cleanFilePath = filePath.replace(/:/g, '-');
      await fs.writeFile(cleanFilePath, JSON.stringify(res.data));
    } catch (error) {
      console.error(`Error getting bookmarks for date range ${fromDateString} to ${toDateString}: `, error);
    }
  }
}

async function politeScrapeForYear() {
  const endDate = moment();
  const startDate = moment().subtract(1, 'years');

  // Get the list of already downloaded files
  const files = await fs.readdir('./public/data/pinboard_bookmarks');

  for (let weekStartDate = startDate; weekStartDate.isBefore(endDate); weekStartDate.add(1, 'weeks')) {
    const weekEndDate = moment(weekStartDate).add(1, 'weeks');
    const fromDateString = moment(weekStartDate).format('YYYY-MM-DDTHH:mm:ss') + "Z";
    const toDateString = moment(weekEndDate).format('YYYY-MM-DDTHH:mm:ss') + "Z";
    const fileName = `${fromDateString}_${toDateString}.json`.replace(/:/g, '-');

    // Check if the file for this week already exists
    if (files.includes(fileName)) {
      console.log(`File ${fileName} already exists, skipping...`);
      continue;
    }

    await gatherBookmarksForWeek(weekStartDate.toDate(), weekEndDate.toDate());
    await new Promise(resolve => setTimeout(resolve, WAIT_BETWEEN_REQUESTS));
  }
  console.log('done');
}

politeScrapeForYear();
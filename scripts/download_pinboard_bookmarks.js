const fs = require('fs').promises;
const moment = require('moment');
const axios = require('axios');
require('dotenv').config();

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

  for (let weekStartDate = startDate; weekStartDate.isBefore(endDate); weekStartDate.add(1, 'weeks')) {
    const weekEndDate = moment(weekStartDate).add(1, 'weeks');
    await gatherBookmarksForWeek(weekStartDate.toDate(), weekEndDate.toDate());
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  console.log('done');
}

politeScrapeForYear();
const Pinboard = require('node-pinboard').default;
const api_token = 'ejfox:6BCADA7AD389C5F5D7CE';
const _ = require('lodash');
// import fs and writefilesync from the fs module
const fs = require('fs');

const pinboard = new Pinboard(api_token);

// pinboard.all().then(res => {
//   console.log(res);
// });

// For the signed in user, grab a list of all the dates where bookmarks were added (this also tells us the number added for each day)
pinboard.dates().then((res) => {
  const pinboardManifest = res;
  // write pinboard manifest to data/pinboard_manifest.json
  // we will use this later to scrape bookmarks for every day
  fs.writeFileSync(
    './public/data/pinboard_manifest.json',
    JSON.stringify(pinboardManifest)
  );

  // Now that the manifest is written, let's grab them one by one
  politeScrapeFromManifest(pinboardManifest);
});

function gatherBookmarksFromManifest(pinboardManifest, date) {
  // a pinboardManifest looks like this:
  // {
  //         '2010-12-16': 3,
  //         '2010-12-15': 2,
  //         '2010-12-13': 1,
  //}

  // get the date
  const date_str = date;
  console.log('Scraping ' + date_str);
  // check if file for date_str already exists
  if (fs.existsSync('./public/data/pinboard_bookmarks/' + date_str + '.json')) {
    console.log('already exists');
    return;
  }
  const dateString = new Date(date_str).toISOString();

  console.log('formatted date, getting', dateString);
  pinboard.get({ dt: dateString}).then((res) => {
    console.log(date_str + ' returned from API ☑️');
    // write the bookmarks to data/pinboard_bookmarks_<date>.json
    fs.writeFileSync(
      './public/data/pinboard_bookmarks_' + date_str + '.json',
      JSON.stringify(res)
    );
  });
}

let datesCounted = 0;
function politeScrapeFromManifest(pinboardManifest) {
  // instead of using _.each, use a count to keep track of how many dates we've scraped and use setTimeout to wait 10 seconds before scraping the next date
  const dateCount = _.size(pinboardManifest.dates);

  setTimeout(function () {
    if (datesCounted < dateCount) {
      const date = _.keys(pinboardManifest.dates)[datesCounted];
      gatherBookmarksFromManifest(pinboardManifest, date);
      datesCounted++;

      politeScrapeFromManifest(pinboardManifest)
    } else {
      console.log('done');
    }
  }, 5000);
}

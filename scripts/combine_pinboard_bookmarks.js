_ = require('lodash')
fs = require('fs')
function combineAllBookmarks(pinboardManifest) {
  const allBookmarks = []
  // loop over each date in the pinboardManifest and rest for 10 seconds
  const dates = pinboardManifest.dates

  // console.log('dates', dates)
  // sort with the most recent date first
  const sortedDates = _.sortBy(dates, (d,i) => {
    // console.log('d', d, 'i', i)
    return -new Date(d).getTime()
  })

  // console.log('sorted dates', sortedDates)

  _.each(dates, (i, date) => {
    // rest for 10 seconds
      // get the date
      const date_str = date;

      console.log('Checking: '+date_str)

      // check if bookmark file exists
      if (fs.existsSync('./public/data/pinboard_bookmarks_' + date_str + '.json')) {
        console.log('✅')

      // get the list of bookmarks for that date
      const bookmarks = fs.readFileSync(
        './public/data/pinboard_bookmarks_' + date_str + '.json')

      allBookmarks.push(JSON.parse(bookmarks).posts)

      console.log('💡')

      }

  })

  const allBookmarksSorted = _.sortBy(allBookmarks.flat(), (b,i) => {
    return -new Date(b.date).getTime()
  })

  // write all bookmarks to public/data/pinboard_bookmarks_all.json
  fs.writeFileSync(
    './public/data/pinboard_bookmarks_all.json',
    JSON.stringify(allBookmarksSorted, null, 2)
  )
}

// load pinboard manifest from file
const pinboardManifest = JSON.parse(fs.readFileSync('./public/data/pinboard_manifest.json'))

combineAllBookmarks(pinboardManifest)
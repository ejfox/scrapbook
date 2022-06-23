const fs = require('fs')
const _ = require('lodash')
const arenaChannelManifest = './public/data/arena_channels.json'
const accessToken = "xty9YjYnwcRiBw2Lna1_2akBRIAIJjA8rM4sRwJxqM0"
const Arena = require('are.na')
const arena = new Arena({accessToken})

// load manifest file
const arenaManifestData = JSON.parse(fs.readFileSync(arenaChannelManifest))


const allArenaBlocks = []

const channelCount = arenaManifestData.length
let channelsScraped = 0
_.each(arenaManifestData, (channel) => {
  console.log('Checking: ', channel.slug)

  arena.channel(channel.slug).contents().then(res => {
    const channelBlocks = res
    // console.log(channelBlocks)

    // write channel blocks to file
    fs.writeFileSync(
      './public/data/arena_blocks_' + channel.slug + '.json',
      JSON.stringify(channelBlocks, null, 2)
    )

    allArenaBlocks.push(channelBlocks)

    if (channelsScraped === channelCount - 1) {
      console.log('💡')
      const allArenaBlocksSorted = _.sortBy(allArenaBlocks, (b,i) => {
        return -new Date(b.updated_at).getTime() })

      // write all bookmarks to public/data/pinboard_bookmarks_all.json
      console.log('Writing all bookmarks')
      fs.writeFileSync(
        './public/data/arena_blocks_all.json',
        JSON.stringify(allArenaBlocksSorted.flat(), null, 2)
      )
    }

    channelsScraped++


    
  })
})

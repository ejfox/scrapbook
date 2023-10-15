const fs = require('fs')
const arenaUID = process.env.ARENA_ID
const secret = process.env.ARENA_SECRET
const accessToken = process.env.ARENA_ACCESS_TOKEN

const Arena = require('are.na')
const arena = new Arena({accessToken})

const userID = 22564
/*
    id: 22564,
    created_at: '2017-11-09T21:21:21.353Z',
    slug: 'ej-fox',
    username: 'EJ Fox',
*/

arena.user(userID).channels().then(res => {
  const channels = res
    console.log(channels)

    // write to arena_channels.json
    fs.writeFileSync(
      './public/data/arena_channels.json',
      JSON.stringify(channels, null, 2)
    )
})
const fs = require('fs')
const arenaUID = "V74Pxg6DdH-lc1NFalndlcXz0ke7EUHylqYIl_a9qps";
const secret = "LFVVErlr5Yzb5IUG0ap6jutGKSdWizM0JmgZQi_ooR8";
const accessToken = "xty9YjYnwcRiBw2Lna1_2akBRIAIJjA8rM4sRwJxqM0"



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
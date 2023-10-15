const { exec, execSync } = require('child_process');


const scripts = [  
  './scripts/download_pinboard_bookmarks.js',
  // './scripts/download_arena_channels.js',
  // './scripts/combine_arena_channels.js',
];

scripts.forEach(script => {
  console.log(`Running ${script}`);
  try {
    const stdout = execSync(`node ${script}`);
    console.log(`stdout: ${stdout}`);
  } catch (error) {
    console.error(`error: ${error.message}`);
  }
});

// Run the combine_EVERYTHING script
exec('node combine_EVERYTHING.js', (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

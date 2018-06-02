"use strict";

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

module.exports = function() {

  var args = minimist(process.argv.slice(2), {});

  var path_to_update;

  if (process.platform == 'linux') path_to_update = '/usr/lib/slack/';
  else if (process.platform == 'darwin') path_to_update = '/Applications/Slack.app/Contents/';
  else if (process.platform == 'win32') path_to_update = '%homepath%\\AppData\\Local\\slack\\';
  else {
    console.log('Invalid OS');
    process.exit(1);
  }

  path_to_update += 'resources/app.asar.unpacked/src/static/ssb-interop.js';

  // delete previous modifications by this module
  var file = fs.readFileSync(path_to_update, 'utf-8');
  // console.log('file:', file);
  //
  file = file.replace(/\n\/\/\sslacktheme_module_start([\s\S]*?)slacktheme_module_stop\n/, '');
  // console.log('file:', file);

  // console.log('match:', file.match(/slacktheme_module_start([\s\S]*?)slacktheme_module_stop/));

  if (args.theme) {
    // use selected theme
    console.log(`Using theme: ${args.theme}`);
    // console.log('theme:', args.theme);
    // console.log('dirname:', __dirname);
    // console.log('cwd:', process.env.cwd);
    try {
      let theme = fs.readFileSync(`${__dirname}/themes/${args.theme}.js`, 'utf-8');

      file += '\n// slacktheme_module_start\n';
      file += theme;
      file += '// slacktheme_module_stop\n';

      // console.log('file after theme:', file);
    } catch (e) {
      console.log('An error occured:', e);
      process.exit(1);
    }

  } else {
    // use default settings, simply write file
    console.log('Using default settings');
  }

  fs.writeFileSync(path_to_update, file);

  console.log('Done, restart slack');
};

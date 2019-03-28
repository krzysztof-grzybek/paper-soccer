const request = require('request');
const fs = require('fs');
const open = require('open');

const secret = require('../secret');
const config = require('../config.json');

const upload = function (archiveDir, packageName) {
  return new Promise(function (resolve, reject) {
    console.log('Uploading archive...');

    request.post({
      url: 'https://graph-video.facebook.com/' + secret.FB_appId + '/assets',
      formData: {
        'access_token': secret.FB_uploadAccessToken,
        'type': 'BUNDLE',
        'comment': 'Uploaded via command line',
        'asset': {
          value: fs.createReadStream(`${archiveDir}/${packageName}.zip`),
          options: {
            filename: 'package.zip',
            contentType: 'application/octet-stream'
          }
        }
      }
    }, function (error, response, body) {
      if (error || !body) reject(error);
      try {
        var jsonResponse = JSON.parse(response.body);
        if (jsonResponse.success) {
          const openUrl =
            'https://developers.facebook.com/apps/' +
            secret.FB_appId +
            '/instant-games/hosting/';

          console.log('Bundle uploaded via the graph API');
          console.log('Don\'t forget you need to publish the build');
          console.log('Opening developer dashboard...');
          open(openUrl);
          resolve();
        } else {
          reject(new Error('Unexpected API response: ' + response.body));
        }
      } catch (e) {
        reject(new Error('Upload failed. ' + e.message));
      }
    });
  });
};

upload(config.archivesDirectory, config.packageName);


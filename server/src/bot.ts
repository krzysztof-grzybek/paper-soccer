/* tslint:disable:no-console */

import express = require('express');
import request = require('request');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.BOT_VERIFY_TOKEN) {
    console.log('Validating webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});

router.post('/', (req, res) => {
  const data = req.body;
  console.log('received bot webhook');
  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach((entry: any) => {
      const pageID = entry.id;
      const timeOfEvent = entry.time;
      // Iterate over each messaging event
      entry.messaging.forEach((event: any) => {
        if (event.message) {
          receivedMessage(event);
        } else if (event.game_play) {
          receivedGameplay(event);
        } else {
          console.log('Webhook received unknown event: ', event);
        }
      });
    });
  }
  res.sendStatus(200);
});

//
// Handle messages sent by player directly to the game bot here
//
function receivedMessage(event: any) {
  console.log('message received');
}

//
// Handle game_play (when player closes game) events here.
//
function receivedGameplay(event: any) {
  // Page-scoped ID of the bot user
  const senderId = event.sender.id;

  // FBInstant player ID
  const playerId = event.game_play.player_id;

  // FBInstant context ID
  const contextId = event.game_play.context_id;

  // Check for payload
  if (event.game_play.payload) {
    //
    // The variable payload here contains data set by
    // FBInstant.setSessionData()
    //
    const payload = JSON.parse(event.game_play.payload);

    // In this example, the bot is just "echoing" the message received
    // immediately. In your game, you'll want to delay the bot messages
    // to remind the user to play 1, 3, 7 days after game play, for example.
    sendMessage(senderId, null, 'Message to game client: "' + payload.message + '"', 'Play now!', payload);
  }
}

//
// Send bot message
//
// player (string) : Page-scoped ID of the message recipient
// context (string): FBInstant context ID. Opens the bot message in a specific context
// message (string): Message text
// cta (string): Button text
// payload (object): Custom data that will be sent to game session
//
function sendMessage(player: any, context: any, message: any, cta: any, payload: any) {
  const button: any = {
    type: 'game_play',
    title: cta,
  };

  if (context) {
    button.context = context;
  }
  if (payload) {
    button.payload = JSON.stringify(payload);
  }
  const messageData = {
    recipient: {
      id: player,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: message,
              buttons: [button],
            },
          ],
        },
      },
    },
  };

  callSendAPI(messageData);

}

function callSendAPI(messageData: any) {
  const graphApiUrl = 'https://graph.facebook.com/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN;
  request({
    url: graphApiUrl,
    method: 'POST',
    json: true,
    body: messageData,
  }, (error, response, body) => {
    console.error('send api returned', 'error', error, 'status code', response.statusCode, 'body', body);
  });
}

export { router }

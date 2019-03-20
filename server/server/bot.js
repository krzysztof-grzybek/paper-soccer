"use strict";
/* tslint:disable:no-console */
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var request = require("request");
var secret = require("../secret.json");
var router = express.Router();
exports.router = router;
router.get('/', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === secret.BOT_VERIFY_TOKEN) {
        console.log('Validating webhook');
        res.status(200).send(req.query['hub.challenge']);
    }
    else {
        console.error('Failed validation. Make sure the validation tokens match.');
        res.sendStatus(403);
    }
});
router.post('/', function (req, res) {
    var data = req.body;
    console.log('received bot webhook');
    // Make sure this is a page subscription
    if (data.object === 'page') {
        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function (entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;
            // Iterate over each messaging event
            entry.messaging.forEach(function (event) {
                if (event.message) {
                    receivedMessage(event);
                }
                else if (event.game_play) {
                    receivedGameplay(event);
                }
                else {
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
function receivedMessage(event) {
    console.log('message received');
}
//
// Handle game_play (when player closes game) events here.
//
function receivedGameplay(event) {
    // Page-scoped ID of the bot user
    var senderId = event.sender.id;
    // FBInstant player ID
    var playerId = event.game_play.player_id;
    // FBInstant context ID
    var contextId = event.game_play.context_id;
    // Check for payload
    if (event.game_play.payload) {
        //
        // The variable payload here contains data set by
        // FBInstant.setSessionData()
        //
        var payload = JSON.parse(event.game_play.payload);
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
function sendMessage(player, context, message, cta, payload) {
    var button = {
        type: 'game_play',
        title: cta,
    };
    if (context) {
        button.context = context;
    }
    if (payload) {
        button.payload = JSON.stringify(payload);
    }
    var messageData = {
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
function callSendAPI(messageData) {
    var graphApiUrl = 'https://graph.facebook.com/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN;
    request({
        url: graphApiUrl,
        method: 'POST',
        json: true,
        body: messageData,
    }, function (error, response, body) {
        console.error('send api returned', 'error', error, 'status code', response.statusCode, 'body', body);
    });
}
//# sourceMappingURL=bot.js.map
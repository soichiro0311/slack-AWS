const https = require('https');
const url = require('url');
const slack_url = 'https://slack.com/api/chat.postMessage';
const slack_req_opts = url.parse(slack_url);
slack_req_opts.method = 'POST';
slack_req_opts.headers = {'Content-Type': 'application/json',
                          'Authorization':'Bearer xoxb-429784472064-431653176420-nZo42nRVN4e7ClAWoqB2VXyp'};
                          
exports.handler = (event,context, callback) => { 
    console.log(event);
    
    // EventApiの認証リクエスト用処理
    if(event.challenge){
        var response = {};
        response.challenge = event.challenge;
        callback(null,response);
        return;
    }
    
    if(event.event.text!='test'){
        callback(null,response);
        return;  
    }
    
    if('username' in event.event){
      if(event.event.username=='Bot-Sample'){
        callback(null,response);
        return;
      }
    }
    
     if('message' in event.event){
      if(event.event.message.username=='Bot-Sample'){
        callback(null,response);
        return;
      }
    }
    
    // slackAPIに返す処理
    var req = https.request(slack_req_opts, function (res) {
      if (res.statusCode === 200) {
        context.succeed('posted to slack');
        console.log('post slack');
      } else {
        context.fail('status code: ' + res.statusCode);
      }
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      context.fail(e.message);
    });

    var data = {
        "token": event.token,
        "channel": event.event.channel,
        "username": "Bot-Sample",
        "text": "どのメニューにいたしますか?",
        "attachments": [
          {
            "text": "Choose a game to play",
            "fallback": "You are unable to choose a game",
            "callback_id": "wopr_game",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "game",
                    "text": "chess",
                    "type": "button",
                    "value": "chess"
                },
                {
                    "name": "game",
                    "text": "Falken's Maze",
                    "type": "button",
                    "value": "maze"
                }
            ]
          }
        ]
    };
    
    req.write(JSON.stringify(data));

    req.end();
    
    callback(null,response);
    return;
};
    
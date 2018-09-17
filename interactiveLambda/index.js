const https = require('https');
const url = require('url');
const spring_url = 'https://connpass.com/api/v1/event/?keyword=';

exports.handler = (event, context,callback) => {
  // 接続情報を作成
  var text=event.text;
  const spring_req_opts = url.parse(spring_url+text);
  spring_req_opts.method = 'GET';
  spring_req_opts.headers = {'Content-Type': 'application/json','User-Agent': 'Node/8.10'};

  // 引数で受け取った情報をログ出力
  console.log(event);
  
  //区切り文字を作成
  var response={};
  response.text='----------'+text+'勉強会リスト----------';
  
  // 勉強会情報を取得
  const req = https.request(spring_req_opts, (res) => {
    // 取得した情報をエンコード
    res.setEncoding('utf-8');
    let data = '';
    //取得した情報のチャンクをつなぎ合わせる
    res.on('data', (chunk) => {
        console.log(chunk);
        data += chunk;
    });
    // 取得データが終端まで逹するとJSONオブジェクトにパース
    res.on('end', () => {
        var dataJson=JSON.parse(data);
        for(let event of dataJson.events) {
          response.text+="\n\n【勉強会タイトル】："+event.title;
          response.text+="\n【勉強会ページリンク】："+event.event_url;
          response.text+="\n【イベント開催日時】："+event.started_at+" ~ "+event.ended_at;
          response.text+="\n【イベント開催場所】："+event.address+" "+event.place;
        }
        // 取得した勉強会イベント情報のうち必要な部分を返す
        console.log(response);
        callback(null,response);
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  req.end();
};
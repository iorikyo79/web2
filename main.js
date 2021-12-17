const express = require('express');
const app = express();
var fs = require('fs');
var qs = require('querystring');
var path = require('path');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var compression = require('compression');
var topicRouter = require('./routes/topic');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false})); // request에서 body를 쉽게 받을수 있도록
app.use(compression()); // post data 압축 전송 처리
app.get('*', function(request, response, next){   // get으로 들어오는 모든(*) 요청에 filelist를 리턴
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});
app.use('/topic', topicRouter);  // 'topic'으로 시작하는 주소에게 topicRouter를 사용하겠다.

// get > route 방식
app.get('/', function (req, res) {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(req.list);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}`,
    `<a href="/topic/create">create</a>`
    );
  res.send(html);
}); 

app.listen(3000, () => console.log('example port 3000'));
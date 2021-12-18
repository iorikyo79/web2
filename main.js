const express = require('express');
const app = express();
var fs = require('fs');
// var qs = require('querystring');
// var path = require('path');
// var template = require('./lib/template.js');
// var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());

var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false})); // request에서 body를 쉽게 받을수 있도록
app.use(compression()); // post data 압축 전송 처리
app.get('*', function(request, response, next){   // get으로 들어오는 모든(*) 요청에 filelist를 리턴
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});
app.use('/', indexRouter);
app.use('/topic', topicRouter);  // 'topic'으로 시작하는 주소에게 topicRouter를 사용하겠다.

app.listen(3000, () => console.log('example port 3000'));
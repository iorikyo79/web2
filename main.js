const express = require('express');
const app = express();
var fs = require('fs');
var qs = require('querystring');
var path = require('path');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var compression = require('compression');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false})); // request에서 body를 쉽게 받을수 있도록
app.use(compression()); // post data 압축 전송 처리
app.get('*', function(request, response, next){   // get으로 들어오는 모든(*) 요청에 filelist를 리턴
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});

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

app.get('/topic/create', function (req, res) {
  var title = 'WEB - create';
  var list = template.list(req.list);
  var html = template.HTML(title, list, `
      <form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '');
  res.send(html)
});

app.get('/topic/:pageId', function (req, res) {
  var filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    var title = req.params.pageId;
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = sanitizeHtml(description, {
      allowedTags: ['h1']
    });

    var list = template.list(req.list);
    var html = template.HTML(sanitizedTitle, list,
      `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
      ` <a href="/topic/create">create</a>
          <a href="/topic/update/${sanitizedTitle}">update</a>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
    );
    res.send(html)
  });
});

app.post('/topic/create_process', function(req,res){
    var post = req.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      res.writeHead(302, {Location: `/topic/${title}`});
      res.end();
    })
});

app.get('/topic/update/:pageId', function (request, response) {
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    var title = request.params.pageId;
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
        <form action="/topic/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
      `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
    );
    response.send(html);
  });
});

app.post('/topic/update_process', function(request, response){
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function (error) {
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      response.redirect(`/topic/${title}`);
    })
  });
});

app.post('/topic/delete_process', function(request, response){
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function (error) {
    response.redirect('/');
  })
});

app.listen(3000, () => console.log('example port 3000'));

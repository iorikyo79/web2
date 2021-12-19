var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

var authData = {
  email: 'iori@gmail.com',
  password: '1234',
  nickname: 'iori'
}

router.get('/login', function (request, response) {
  var title = 'WEB - login';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>
  `, '');
  response.send(html);
});

router.post('/login_process', function (request, response) {
  var post = request.body;
  var email = post.email;
  var password = post.pwd;
  if(email === authData.email && password === authData.password){
    request.session.is_logined = true;
    request.session.nickname = authData.nickname;
    request.session.save(function(){
      response.redirect(`/`);
    });
  } else {
    response.send('Who?');
  }
});

router.get('/logout', function (request, response) {
  request.session.destroy(function(err){
    response.redirect('/');
  });
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// var template = require('../lib/template.js');

// router.post('/login_process', function(req, res){
//     var post = req.body;
//     console.log(post.id, post.password);
   
//     if(post.id === 'iori'){
//         res.writeHead(302, {
//             'Set-Cookie': [
//                 `id=${post.id}; path=/`,
//                 `pw=${post.password}; path=/`
//             ],
//             Location:'/'
//         });
//         res.end();
//     }else{
//         res.redirect('/');
//     }

//     // if (post.id === 'iori') {
//     //     var title = 'Welcome';
//     //     var description = 'Hello, Node.js';
//     //     var html = template.HTML(title, '',
//     //         `<h2>${title}</h2>${description}`,
//     //         `<a href="/topic/create">create</a>`
//     //     );

//     //     res.writeHead(200, {
//     //         'Set-Cookie': [
//     //             `id=${post.id}; path=/`,
//     //             `pw=${post.password}; path=/`
//     //         ]
//     //     }).end(html); // end()는 string만 지원하기 때문에 html이 정상 출력 안됨. redirect로 보내야함.
//     // }
// });

// module.exports = router;
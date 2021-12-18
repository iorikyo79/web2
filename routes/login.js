const express = require('express');
const router = express.Router();
var template = require('../lib/template.js');

router.post('/login_process', function(req, res){
    var post = req.body;
    console.log(post.id, post.password);
   
    if(post.id === 'iori'){
        res.writeHead(302, {
            'Set-Cookie': [
                `id=${post.id}; path=/`,
                `pw=${post.password}; path=/`
            ],
            Location:'/'
        });
        res.end();
    }else{
        res.redirect('/');
    }

    // if (post.id === 'iori') {
    //     var title = 'Welcome';
    //     var description = 'Hello, Node.js';
    //     var html = template.HTML(title, '',
    //         `<h2>${title}</h2>${description}`,
    //         `<a href="/topic/create">create</a>`
    //     );

    //     res.writeHead(200, {
    //         'Set-Cookie': [
    //             `id=${post.id}; path=/`,
    //             `pw=${post.password}; path=/`
    //         ]
    //     }).end(html); // end()는 string만 지원하기 때문에 html이 정상 출력 안됨. redirect로 보내야함.
    // }
});

module.exports = router;
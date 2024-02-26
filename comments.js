// create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var port = 8080;
var comments = [];

var server = http.createServer(function(req, res) {
    var urlObj = url.parse(req.url, true);
    if (urlObj.pathname === '/api/comments' && req.method === 'GET') {
        var commentsStr = fs.readFileSync('comments.json');
        comments = JSON.parse(commentsStr);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(comments));
    }
    else if (urlObj.pathname === '/api/comments' && req.method === 'POST') {
        var body = '';
        req.on('data', function(chunk) {
            body += chunk;
        });
        req.on('end', function() {
            var comment = JSON.parse(body);
            comments.push(comment);
            fs.writeFileSync('comments.json', JSON.stringify(comments));
            res.end(JSON.stringify(comments));
        });
    }
    else {
        res.statusCode = 404;
        res.end();
    }
});

server.listen(port);
console.log('Server listening on port ' + port);
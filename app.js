var express = require('express');
var path = require('path'); 
var app = express();
var http = require('http');

app.use(express.static(path.join(__dirname, "public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)

app.listen(3000, function(){
    console.log('Express server');
});


